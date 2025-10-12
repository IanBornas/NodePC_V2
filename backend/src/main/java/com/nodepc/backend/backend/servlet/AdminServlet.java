package com.nodepc.backend.backend.servlet;

import com.nodepc.backend.backend.service.ProductService;
import com.nodepc.backend.backend.service.OrderService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/admin-servlet/dashboard")
public class AdminServlet extends HttpServlet {

    @Autowired private ProductService productService;
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

        long totalProducts = productService.countProducts();
        long totalOrders = orderService.countOrders();

        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("    <meta charset='UTF-8'>");
        out.println("    <meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        out.println("    <title>NodePC Admin Dashboard</title>");
        out.println("    <style>");
        out.println("        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }");
        out.println("        h1 { color: #333; text-align: center; margin-bottom: 30px; }");
        out.println("        .dashboard { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; max-width: 1200px; margin: 0 auto; }");
        out.println("        .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); flex: 1; min-width: 250px; text-align: center; }");
        out.println("        .card h2 { margin: 0 0 10px 0; color: #333; }");
        out.println("        .card .value { font-size: 2em; font-weight: bold; color: #4CAF50; margin: 10px 0; }");
        out.println("        .card.products .value { color: #2196F3; }");
        out.println("        .card.orders .value { color: #FF9800; }");
        out.println("        .card.status { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; }");
        out.println("        .card.status .value { color: white; }");
        out.println("        .card.status h2 { color: white; }");
        out.println("    </style>");
        out.println("</head>");
        out.println("<body>");
        out.println("    <h1>NodePC Admin Dashboard</h1>");
        out.println("    <div class='dashboard'>");
        out.println("        <div class='card products'>");
        out.println("            <h2>Total Products</h2>");
        out.println("            <div class='value'>" + totalProducts + "</div>");
        out.println("        </div>");
        out.println("        <div class='card orders'>");
        out.println("            <h2>Total Orders</h2>");
        out.println("            <div class='value'>" + totalOrders + "</div>");
        out.println("        </div>");
        out.println("        <div class='card status'>");
        out.println("            <h2>System Status</h2>");
        out.println("            <div class='value'>✅ Running</div>");
        out.println("            <p>Tomcat Server Active</p>");
        out.println("        </div>");
        out.println("    </div>");
        out.println("</body>");
        out.println("</html>");
    }
}
