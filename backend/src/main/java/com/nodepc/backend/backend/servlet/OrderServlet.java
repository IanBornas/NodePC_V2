package com.nodepc.backend.backend.servlet;

import com.nodepc.backend.backend.model.Order;
import com.nodepc.backend.backend.service.OrderService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/admin-servlet/orders")
public class OrderServlet extends HttpServlet {

    private OrderService orderService;

    @Override
    public void init() throws ServletException {
        SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, getServletContext());
    }

    public void setOrderService(OrderService orderService) {
        this.orderService = orderService;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain");
        PrintWriter out = resp.getWriter();
        List<Order> orders = orderService.getAllOrders();
        for (Order o : orders) {
            String userId = o.getUser() != null ? String.valueOf(o.getUser().getId()) : "null";
            out.println("ID: " + o.getId() + " | UserID: " + userId + " | Total: " + o.getTotalAmount());
        }
    }
}
