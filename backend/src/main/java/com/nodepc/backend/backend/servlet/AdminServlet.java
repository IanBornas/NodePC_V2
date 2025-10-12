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

        resp.setContentType("text/plain");
        PrintWriter out = resp.getWriter();

        out.println("===== NodePC Admin Dashboard =====");
        out.println("Total Products: " + productService.countProducts());
        out.println("Total Orders: " + orderService.countOrders());
        out.println("System Status: ✅ Running fine on Tomcat");
    }
}
