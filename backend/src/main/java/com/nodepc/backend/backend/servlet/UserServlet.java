package com.nodepc.backend.backend.servlet;

import com.nodepc.backend.backend.model.User;
import com.nodepc.backend.backend.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/admin-servlet/users")
public class UserServlet extends HttpServlet {
    @Autowired private UserService userService;

    @Override
    public void init() throws ServletException { SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, getServletContext()); }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain");
        PrintWriter out = resp.getWriter();
        out.println("NodePC Users");
        out.println("------------");
        List<User> users = userService.getAllUsers();
        users.forEach(u -> out.printf("%d | %s | %s | %s%n", u.getId(), u.getUsername(), u.getEmail(), u.getRole()));
    }
}
