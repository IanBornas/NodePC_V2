package com.nodepc.backend.backend.servlet;

import com.nodepc.backend.backend.DTO.ProductResponse;
import com.nodepc.backend.backend.service.ProductService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/admin-servlet/products")
public class ProductServlet extends HttpServlet {

    @Autowired private ProductService productService;

    @Override
    public void init() throws ServletException {
        SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, getServletContext());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("text/html");
        PrintWriter out = resp.getWriter();

        List<ProductResponse> products = productService.getAllProducts();

        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("    <meta charset='UTF-8'>");
        out.println("    <meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        out.println("    <title>NodePC Products</title>");
        out.println("    <style>");
        out.println("        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }");
        out.println("        h1 { color: #333; text-align: center; }");
        out.println("        table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }");
        out.println("        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }");
        out.println("        th { background-color: #4CAF50; color: white; }");
        out.println("        tr:hover { background-color: #f5f5f5; }");
        out.println("        .price { color: #e74c3c; font-weight: bold; }");
        out.println("        .container { max-width: 1200px; margin: 0 auto; }");
        out.println("    </style>");
        out.println("</head>");
        out.println("<body>");
        out.println("    <div class='container'>");
        out.println("        <h1>NodePC Products</h1>");
        out.println("        <table>");
        out.println("            <thead>");
        out.println("                <tr>");
        out.println("                    <th>ID</th>");
        out.println("                    <th>Name</th>");
        out.println("                    <th>Description</th>");
        out.println("                    <th>Price</th>");
        out.println("                    <th>Stock</th>");
        out.println("                    <th>Category</th>");
        out.println("                </tr>");
        out.println("            </thead>");
        out.println("            <tbody>");

        for (ProductResponse p : products) {
            out.println("                <tr>");
            out.println("                    <td>" + p.getId() + "</td>");
            out.println("                    <td>" + p.getName() + "</td>");
            out.println("                    <td>" + p.getDescription() + "</td>");
            out.println("                    <td class='price'>₱" + String.format("%.2f", p.getPrice()) + "</td>");
            out.println("                    <td>" + p.getStock() + "</td>");
            out.println("                    <td>" + p.getCategory() + "</td>");
            out.println("                </tr>");
        }

        out.println("            </tbody>");
        out.println("        </table>");
        out.println("    </div>");
        out.println("</body>");
        out.println("</html>");
    }
}
