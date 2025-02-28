package com.lec.spring.mytrip.controller;

import com.lec.spring.mytrip.domain.PackagePost;
import com.lec.spring.mytrip.domain.Payment;
import com.lec.spring.mytrip.domain.User;
import com.lec.spring.mytrip.repository.PackagePostRepository;
import com.lec.spring.mytrip.service.PackagePostService;
import com.lec.spring.mytrip.service.UserServiceImpl;
import com.lec.spring.mytrip.service.BusinessMypageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Slf4j
@Controller
@RequestMapping("/mypage")
public class BusinessMypageController {

    private final BusinessMypageService businessMypageService;
    private final UserServiceImpl userService;
    private final PackagePostService packagePostService;
    private final PackagePostRepository packagePostRepository;

    @Autowired
    public BusinessMypageController(BusinessMypageService businessMypageService, UserServiceImpl userService, PackagePostService packagePostService, PackagePostRepository packagePostRepository) {
        System.out.println("BusinessMypageController() 작동");
        this.businessMypageService = businessMypageService;
        this.userService = userService;
        this.packagePostService = packagePostService;
        this.packagePostRepository = packagePostRepository;
    }

    // 기업 마이페이지 메인
    @GetMapping("/business/{userId}")
    public String businessMypage(@PathVariable("userId") int userId, Model model) {
        try {
            // 유저 정보 가져오기
            User user = businessMypageService.getUserById(userId);

            if (user == null) {
                model.addAttribute("error", "해당 유저를 찾을 수 없습니다.");
                return "error";
            }

            // 유저 상태 확인
            if (!"승인".equals(user.getStatus())) {
                model.addAttribute("error", "접근 권한이 없습니다.");
                return "error";
            }

            // 유저 정보 추가
            model.addAttribute("user", user);

            // 결제 정보와 패키지 정보 가져오기 (없으면 빈 리스트로 초기화)
            List<PackagePost> packagePost = new ArrayList<>();
            List<Payment> payment = new ArrayList<>();

            try {
                packagePost = packagePostRepository.likeCntByPackage(userId);
            } catch (Exception e) {
                log.warn("패키지 정보 로드 실패", e);
            }

            try {
                payment = businessMypageService.getPaymentByCompanyId(userId);
            } catch (Exception e) {
                log.warn("결제 정보 로드 실패", e);
            }

            // 결제 정보와 패키지 정보 추가
            model.addAttribute("packagePost", packagePost);
            model.addAttribute("payment", payment);

            // 비즈니스 마이페이지 뷰 반환
            return "mypage/businessMain";

        } catch (Exception e) {
            log.error("페이지 로드 중 오류 발생", e);
            model.addAttribute("error", e.getMessage());
            return "error";
        }
    }

    // 기업 정보 출력 -> 메인 페이지
    // 기업이 등록한 패키지 리스트 (패키지 제목, 패키지 내용, 패키지, 패키지 승인 상태, 좋아요 수) -> 메인 페이지
    // JSON API 엔드포인트(js요청)
    // businessMain.html
    @GetMapping("/business/js/{userId}")
    @ResponseBody
    public ResponseEntity<?> businessMypage(@PathVariable("userId") int userId) {
        try {
            // 유저 정보 로드
            User user = businessMypageService.getUserById(userId);

            // 디버깅용 로그
            log.info("user found: {}", user);
            log.info("userID: {}", userId);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("해당 유저를 찾을 수 없습니다.");
            }

            // 승인된 유저만 접근 가능
            if (!"승인".equals(user.getStatus())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("접근 권한이 없습니다.");
            }

            // 패키지 정보 로드 (없으면 빈 리스트 반환)
            List<PackagePost> packages = Collections.emptyList();
            try {
                packages = packagePostRepository.likeCntByPackage(userId);
            } catch (Exception e) {
                log.warn("패키지 정보 로드 실패", e);
            }

            // 결제 정보 로드 (없으면 빈 리스트 반환)
            List<Payment> payments = Collections.emptyList();
            try {
                payments = businessMypageService.getPaymentByCompanyId(userId);
            } catch (Exception e) {
                log.warn("결제 정보 로드 실패", e);
            }


            // 반환 데이터 생성
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("user", user);
            responseData.put("packages", packages);
            responseData.put("payments", payments);

            return ResponseEntity.ok(responseData);

        } catch (Exception e) {
            log.error("패키지 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("패키지 조회 중 오류가 발생했습니다: " + e.getMessage());
        }

    }

    // 기업 개인정보 조회
    // JSON API 엔드포인트(js요청)
    // businessMain.html
    @GetMapping("/business/profile/{userId}")
    @ResponseBody
    public ResponseEntity<?> getCompanyProfile(@PathVariable("userId") int userId) {
        try {
            // 유저 조회
            User user = businessMypageService.getUserById(userId);

            if(user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 데이터를 찾을 수 없습니다.");
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("프로필 불러오기 중 예외 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }

    // 기업 개인정보 수정
    // 이미지 업데이트
    // 비밀번호 수정 =>mypageService, mypageController 사용.
    @PostMapping("/business/update/{userId}")
    public ResponseEntity<Map<String, String>> updateBusiness (
            @PathVariable("userId") int userId,
            @RequestBody Map<String, String> updateRequest  // 모든 데이터를 Map으로 받습니다.
    ) {


        Map<String, String> response = new HashMap<>();

        // 전달받은 정보 출력
        log.info("Received request to update user {}", userId);

        // 전달받은 정보
        String currentPassword = updateRequest.get("currentPassword");
        String newPassword = updateRequest.get("newPassword");

        // 사용자 업데이트 호출
        boolean success = businessMypageService.updateCompany(userId, currentPassword, newPassword);

        if (success) {
            response.put("message", "정보가 성공적으로 업데이트되었습니다.");
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "정보 업데이트에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/info/{userId}")
    @ResponseBody
    public ResponseEntity<Resource> getProfileImage(@PathVariable("userId") int userId) {
        User user = businessMypageService.getUserById(userId);

        Path imagePath = (user != null && user.getProfile() != null)
                ? Paths.get("static/uploads/profiles/", user.getProfile())
                : Paths.get("img", "defaultProfile.jpg");

        Resource resource = new FileSystemResource(imagePath);
        if (resource.exists()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        }
        return ResponseEntity.notFound().build();
    }


    // 기업이 등록한 모든 패키지에 관한 일반 유저의 결제 내역(사용자, 패키지 상품 제목, 결제 상태) -> 모달
    // 결제 리스트 데이터 반환
    // JSON API 엔드포인트(js요청)
    // businessMain.html main 에서 결제 버튼 클릭 시 해당 정보가 담긴 모달 출력
    @GetMapping("/business/payments/{userId}")
    @ResponseBody
    public ResponseEntity<List<Payment>> getBusinessPayments(@PathVariable("userId") int userId) {
        try {
            log.info("컨트롤러에서 보내는 비지니스 아이디 {}", userId);
            List<Payment> payments = businessMypageService.getPaymentByCompanyId(userId);
            payments.forEach(e -> log.info("이거 나오면 대따 대따 다대따: {}", e.toString()));
            log.info("Business data: {}", payments);
            log.info("userId found: {}", userId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            log.error("결제 정보 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // 등록한 패키지 클릭 시 상세보기 -> 모달
    // 패키지 상세 정보 반환
    // JSON API 엔드포인트(js요청)
    // businessMain.html main 에서 패키지 클릭 시 해당 정보가 담긴 모달 출력
    @GetMapping("/business/package/{packageId}")
    @ResponseBody
    public ResponseEntity<?> getPackageDetails(@PathVariable("packageId") int packageId) {
        try {
            List<PackagePost> packagePost = packagePostService.getPackageDetailsById(packageId);

            int cityId = packagePost.get(0).getCityId();
            log.info("cityId: {}", cityId);

            if(packagePost == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(packagePost);
        } catch (Exception e) {
            log.error("패키지 상세 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError().body("패키지 상세 조회 중 오류가 발생해습니다.");
        }
    }

}


