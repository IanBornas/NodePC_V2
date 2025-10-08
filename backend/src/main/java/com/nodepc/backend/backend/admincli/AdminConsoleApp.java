package com.nodepc.backend.backend.admincli;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Scanner;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class AdminConsoleApp {
    private static final String BASE_URL = "http://localhost:8080";
    private static String jwtToken = null;
    private static final HttpClient client = HttpClient.newHttpClient();
    private static final ObjectMapper mapper = new ObjectMapper();

    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.println("\nAdmin CLI — choose action:");
            System.out.println("1) Login");
            System.out.println("2) List products");
            System.out.println("3) Create product");
            System.out.println("4) Update product");
            System.out.println("5) Delete product");
            System.out.println("6) Exit");
            System.out.print("> ");
            String choose = scanner.nextLine();
            switch (choose) {
                case "1":
                    doLogin(scanner);
                    break;
                case "2":
                    listProducts();
                    break;
                case "3":
                    createProduct(scanner);
                    break;
                case "4":
                    updateProduct(scanner);
                    break;
                case "5":
                    deleteProduct(scanner);
                    break;
                case "6":
                    scanner.close();
                    System.exit(0);
                default:
                    System.out.println("Unknown option");
            }
        }
    }

    private static void doLogin(Scanner scanner) throws Exception {
        System.out.print("Username: ");
        String u = scanner.nextLine();
        System.out.print("Password: ");
        String p = scanner.nextLine();
        String body = String.format("{\"username\":\"%s\",\"password\":\"%s\"}", u, p);
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/auth/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
        if (res.statusCode() != 200) {
            System.out.println("Login failed: " + res.body());
            return;
        }
        String token = extractToken(res.body());
        jwtToken = token;
        System.out.println("Logged in. JWT stored.");
    }

    private static void listProducts() throws Exception {
        HttpRequest.Builder rb = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/products"))
                .GET();
        addAuth(rb);
        HttpResponse<String> res = client.send(rb.build(), HttpResponse.BodyHandlers.ofString());
        System.out.println("Status: " + res.statusCode());
        System.out.println(res.body());
    }

    private static void createProduct(Scanner scanner) throws Exception {
        System.out.print("Name: ");
        String name = scanner.nextLine();
        System.out.print("Price: ");
        String price = scanner.nextLine();
        System.out.print("Description: ");
        String desc = scanner.nextLine();
        String json = String.format("{\"name\":\"%s\",\"price\":%s,\"description\":\"%s\"}", escape(name), price, escape(desc));
        HttpRequest.Builder rb = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/products"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json));
        addAuth(rb);
        HttpResponse<String> res = client.send(rb.build(), HttpResponse.BodyHandlers.ofString());
        System.out.println("Status: " + res.statusCode());
        System.out.println(res.body());
    }

    private static void updateProduct(Scanner scanner) throws Exception {
        System.out.print("Product ID: ");
        String id = scanner.nextLine();
        System.out.print("New name (leave blank to skip): ");
        String name = scanner.nextLine();
        System.out.print("New price (leave blank to skip): ");
        String price = scanner.nextLine();
        System.out.print("New description (leave blank to skip): ");
        String desc = scanner.nextLine();
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        if (!name.isBlank()) {
            sb.append("\"name\":\"").append(escape(name)).append("\""); first=false;}
        if (!price.isBlank()) { if (!first) sb.append(","); sb.append("\"price\":").append(price); first=false;}
        if (!desc.isBlank()) { if (!first) sb.append(","); sb.append("\"description\":\"").append(escape(desc)).append("\""); first=false;}
        sb.append("}");
        HttpRequest.Builder rb = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/products/" + id))
                .header("Content-Type", "application/json")
                .PUT(HttpRequest.BodyPublishers.ofString(sb.toString()));
        addAuth(rb);
        HttpResponse<String> res = client.send(rb.build(), HttpResponse.BodyHandlers.ofString());
        System.out.println("Status: " + res.statusCode());
        System.out.println(res.body());
    }

    private static void deleteProduct(Scanner scanner) throws Exception {
        System.out.print("Product ID: ");
        String id = scanner.nextLine();
        HttpRequest.Builder rb = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/products/" + id))
                .DELETE();
        addAuth(rb);
        HttpResponse<String> res = client.send(rb.build(), HttpResponse.BodyHandlers.ofString());
        System.out.println("Status: " + res.statusCode());
        System.out.println(res.body());
    }

    private static void addAuth(HttpRequest.Builder rb) {
        if (jwtToken != null) {
            rb.header("Authorization", "Bearer " + jwtToken);
        }
    }

    private static String extractToken(String responseBody) {
        try {
            JsonNode node = mapper.readTree(responseBody);
            if (node.has("token")) return node.get("token").asText();
            if (node.has("accessToken")) return node.get("accessToken").asText();
            if (node.has("data") && node.get("data").has("token")) return node.get("data").get("token").asText();
            throw new RuntimeException("No token found in response: " + responseBody);
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract token from response: " + responseBody, e);
        }
    }

    private static String escape(String s) {
        return s.replace("\"", "\\\"");
    }
}
