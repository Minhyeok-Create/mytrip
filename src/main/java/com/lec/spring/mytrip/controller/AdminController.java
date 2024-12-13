package com.lec.spring.mytrip.controller;

import com.lec.spring.mytrip.config.PrincipalDetails;
import com.lec.spring.mytrip.domain.*;
import com.lec.spring.mytrip.service.AdminService;
import com.lec.spring.mytrip.service.UserService;
import com.lec.spring.mytrip.util.U;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private UserValidator userValidator;
    private AuthenticationManager authenticationManager;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @Autowired
    public void setUserValidator(UserValidator userValidator) {
        this.userValidator = userValidator;
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.setValidator(userValidator);
    }

    // 로그인 페이지
    @GetMapping("/adminLogin")
    public String login(Model model, HttpSession session) {
        return "admin/adminLogin";
    }

    @GetMapping("/userTables")
    public String userTables(Model model, HttpSession session) {
        User loggedUser = U.getLoggedUser();
        model.addAttribute("adminUser", loggedUser);

        // session 에 저장된 유저 정보가 없거나 권한이 ROLE_ADMIN이 아닐 경우 adminLogin 페이지로 redirect
        if(loggedUser == null || !loggedUser.getAuthorization().equalsIgnoreCase("ROLE_ADMIN")) {
            return "redirect:/admin/adminLogin";
        }

        // ROLE_USER 인 유저 정보 가져와서 model 에 저장
        List<User> users = adminService.findByAuthorityRoleUser("ROLE_USER");
        model.addAttribute("users", users);

        return "admin/userTables";
    }

    // adminLogin 에서 로그인을 시도하는 관리자의 login을 처리하는 Controller
    @PostMapping("/login")
    public ModelAndView adminLogin(@RequestParam("username") String username, @RequestParam("password") String password, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            if (authentication.isAuthenticated()) {
                // 인증된 사용자 정보를 세션에 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 세션에 사용자 정보를 저장
                Object principal = authentication.getPrincipal();

                // principal 객체가 PrincipalDetails 클래스의 인스턴스인지 확인
                if(principal instanceof PrincipalDetails) {
                    // principal 객체를 PrincipalDetails 타입으로 캐스팅
                    PrincipalDetails details = (PrincipalDetails) principal;
                    // 현재 Http 요청과 연결된 사용자의 정보를 세션에 저장
                    request.getSession().setAttribute("loggedInUser", details.getUser());
                }

                System.out.println("Session ID : " + request.getSession().getId());
                System.out.println("Logged User: " + request.getSession().getAttribute("loggedInUser"));

                return new ModelAndView("redirect:/admin/userTables");
            } else {
                return new ModelAndView("redirect:/admin/adminLogin?error=true");
            }
        } catch (AuthenticationException e) {
            return new ModelAndView("redirect:/admin/adminLogin?error=true");
        }
    }


    @PostMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/admin/adminLogin";
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/deleteuser")
    @ResponseBody
    public ResponseEntity<String> deleteUser(@RequestParam("userId") int userId) {
        try {
            adminService.deleteUser(userId); // 서비스 메서드 호출
            System.out.println("User with ID " + userId + " deleted successfully.");
            return ResponseEntity.ok("User deleted successfully!");
        } catch (Exception e) {
            System.err.println("Error deleting user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user.");
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/businessTables")
    public String businessTables(Model model, HttpSession session) {
        List<User> businessUsers = adminService.findByAuthorityRoleBusiness("ROLE_BUSINESS");
        model.addAttribute("businessUsers", businessUsers);
        return "admin/businessTables";
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/boardTables")
    public String boardTables(Model model, HttpSession session) {
        List<Board> boards = adminService.findByBoardCategory("소모임");
        model.addAttribute("boards", boards);
        return "admin/boardTables";
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/feedTables")
    public String feedTables(Model model, HttpSession session) {
        List<Board> feeds = adminService.findByFeedCategory("피드");
        model.addAttribute("feeds", feeds);
        return "admin/feedTables";
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/deletePost")
    @ResponseBody
    public ResponseEntity<String> deletePost(@RequestParam("boardId") int boardId) {
        try {
            adminService.deleteBoard(boardId); // 서비스 메서드 호출
            System.out.println("Board with ID " + boardId + " deleted successfully.");
            return ResponseEntity.ok("Board deleted successfully!");
        } catch (Exception e) {
            System.err.println("Error deleting board: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete board.");
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/packageAccessTables")
    public String packageAccessTables(Model model, HttpSession session) {
        List<PackagePost> AccessPackages = adminService.findByAccessPackage("승인");
        model.addAttribute("AccessPackages", AccessPackages);
        return "admin/packageAccessTables";
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/packageStandbyTables")
    public String packageStandbyTables(Model model, HttpSession session) {
        List<PackagePost> standByPackages = adminService.findByStandByPackage("미승인", "대기");
        model.addAttribute("standByPackages", standByPackages);
        return "admin/packageStandbyTables";
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/deletePackage")
    @ResponseBody
    public ResponseEntity<String> deletePackage(@RequestParam("packageId") int packageId) {
        try {
            adminService.deleteBoard(packageId); // 서비스 메서드 호출
            System.out.println("Board with ID " + packageId + " deleted successfully.");
            return ResponseEntity.ok("Board deleted successfully!");
        } catch (Exception e) {
            System.err.println("Error deleting board: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete board.");
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/paymentTables")
    public String paymentTables(Model model, HttpSession session) {
        List<Payment> payments = adminService.findByPayment();
        model.addAttribute("payments", payments);
        return "admin/paymentTables";
    }

    @RequestMapping("/auth")
    @ResponseBody
    public Authentication auth(){
        return SecurityContextHolder.getContext().getAuthentication();
    }

    // 로그인 오류 처리
    @PostMapping("/loginError")
    public String loginError() {
        System.out.println("로그인 error");
        return "admin/adminLogin";
    }

    // 인증 거부 처리
    @RequestMapping("/rejectAuth")
    public String rejectAuth() {
        return "common/rejectAuth";
    }


    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
}
