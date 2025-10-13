package com.nodepc.backend.backend.servlet;

import com.nodepc.backend.backend.DTO.OrderResponse;
import com.nodepc.backend.backend.service.OrderService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/admin-servlet/orders")
public class OrderServlet extends HttpServlet {

    @Autowired private OrderService orderService;

    @Override
    public void init() throws ServletException {
        SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, getServletContext());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("text/html");
        PrintWriter out = resp.getWriter();

        List<OrderResponse> orders = orderService.getAllOrders();

        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("    <meta charset='UTF-8'>");
        out.println("    <meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        out.println("    <title>NodePC Orders</title>");
        out.println("    <style>");
        out.println("        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }");
        out.println("        h1 { color: #333; text-align: center; }");
        out.println("        table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }");
        out.println("        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }");
        out.println("        th { background-color: #2196F3; color: white; }");
        out.println("        tr:hover { background-color: #f5f5f5; }");
        out.println("        .price { color: #e74c3c; font-weight: bold; }");
        out.println("        .status { font-weight: bold; }");
        out.println("        .status.PENDING { color: #f39c12; }");
        out.println("        .status.COMPLETED { color: #27ae60; }");
        out.println("        .status.CANCELLED { color: #e74c3c; }");
        out.println("        .container { max-width: 1200px; margin: 0 auto; }");
        out.println("    </style>");
        out.println("</head>");
        out.println("<body>");
        out.println("    <div class='container'>");
        out.println("        <h1>NodePC Orders</h1>");
        out.println("        <table>");
        out.println("            <thead>");
        out.println("                <tr>");
        out.println("                    <th>ID</th>");
        out.println("                    <th>Username</th>");
        out.println("                    <th>Total Amount</th>");
        out.println("                    <th>Status</th>");
        out.println("                </tr>");
        out.println("            </thead>");
        out.println("            <tbody>");

        for (OrderResponse o : orders) {
            out.println("                <tr>");
            out.println("                    <td>" + o.getId() + "</td>");
            out.println("                    <td>" + o.getUsername() + "</td>");
            out.println("                    <td class='price'>₱" + String.format("%.2f", o.getTotalAmount()) + "</td>");
            out.println("                    <td class='status " + o.getStatus() + "'>" + o.getStatus() + "</td>");
            out.println("                </tr>");
        }

        out.println("            </tbody>");
        out.println("        </table>");
        out.println("    </div>");
        out.println("</body>");
        out.println("</html>");
    }
}
