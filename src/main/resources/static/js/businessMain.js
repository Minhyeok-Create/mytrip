// 현재 페이지의 경로에서 userId 추출하기
const path = window.location.pathname; // 예: "/mypage/business/123"
const segments = path.split('/'); // 예: ["", "mypage", "business", "123"]

// userId가 마지막 segment에 있다고 가정
const userId = segments[segments.length - 1]; // 마지막 세그먼트 추출

document.addEventListener("DOMContentLoaded", function () {
    // 패키지 리스트 동적 생성 부분
    const packageListContainer = document.querySelector('.package-list');
    if(!packageListContainer) {
        console.error(".packgage-list 컨테이너가 존재하지 않습니다.");
        return;
    }

    console.log("추출된 userId: ",userId); // 예: userId 확인

    // 메인 페이지 정보 로드
    fetch(`/mypage/business/js/${userId}`, {
    })
        .then(response => {
            console.log("응답 상태 코드:", response.status);
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            if(!contentType || !contentType.includes('application/json')) {
                throw new TypeError("기본 정보 데이터 : 서버 응답이 JSON 형식이 아닙니다.")
            }
            return response.json();
        })
        .then(data => {
            console.log("api로부터 받은 데이터: ", data);

            // 데이터 형식 확인, 패키지 확인
            if(!Array.isArray(data) || data.length === 0) {
                packageListContainer.innerHTML = '<p>등록된 패키지가 없습니다.</p>';
                return;
            }

            // 패키지 리스트 데이터 렌더링
            packageListContainer.innerHTML = data.map(packages => `
                <div class="package-item" id="package-item" data-package-id="${packages.packageId}">
                    <div class="package-title">
                        <div class="package-name">${packages.packageTitle}</div>
                    </div>
                    <div class="package-content">${packages.packageContent}</div>
                    <div class="package-status ${getStatusClass(packages.packageStatus)}">${getStatusText(packages.packageStatus)}</div>
                    <div class="liked">
                        <img src="/img/heart-icon-fill.png" alt="heart-icon-fill" id="liked-heart-icon" type="button">
                        <span class="likedCnt">${packages.likedCount}</span>
                    </div>
                </div>
            `).join('');

        })
        .catch(error => {
            console.error('Error fetching package data:', error);
            packageListContainer.innerHTML = '<p>패키지를 불러오는 중 오류가 발생했습니다.</p>';
        });
}); // 페이지 로드 괄호 닫기

// 패키지 상세보기
document.addEventListener("DOMContentLoaded", function () {
    const packageDetailContainer = document.querySelector('.packageDetail');
    let selectedPackageId = null;   // 선택된 패키지 ID 저장

    // 패키지 아이템들에 이벤트 리스너 추가
    // const packageItems = document.querySelectorAll('.package-item');
    // packageItems.forEach(item => {
    //     item.addEventListener('click', function() {
    //         selectedPackageId = this.dataset.packageId; // 선택된 패키지 ID 저장
    //     });
    // });

    // 이벤트 위임으로 동적 요소 처리
    document.body.addEventListener('click', function (event) {
        const packageDetailButton = event.target.closest('#package-item');
        if (packageDetailButton) {
            // 패키지 ID 가져오기
            selectedPackageId = packageDetailButton.dataset.packageId;

            if (!selectedPackageId) {
                console.error('패키지 ID를 가져올 수 없습니다.');
                return;
            }

            // 패키지 상세보기 요청
            console.log("패키지 상세보기 요청: ", selectedPackageId);

            fetch(`/mypage/business/package/${selectedPackageId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log("패키지 서버 응답: ", response)
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        throw new TypeError("패키지 상세보기 데이터 : 서버 응답이 JSON 형식이 아닙니다.");
                    }
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(packages => {
                    console.log("패키지 데이터 확인: ", packages);

                    // 패키지 상세보기 데이터 렌더링
                    packageDetailContainer.innerHTML = packages.map(packageDetail => `
                        <div class="modal-content" data-package-id="${packageDetail.selectedPackageId}">
                            <span class="close-button">&times;</span>
                            <div class="package-title">${packageDetail.packageTitle}</div>
                            <div class="package-regdate"></div>

                            <div class="modal-body">
                                <div class="image-section">
                                    <div class="slideshow-container">
                                        <div class="slide-fade">
                                        
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="info-section">
                                <label for="cityName">
                                    <span>도시</span>
                                    <input type="text" class="cityName" value="${packageDetail.cityName}">
                                </label>
                                <label for="packageStartDay" class="packageStartDay">
                                    <span>시작일</span>
                                    <input type="date" class="packageStartDay" value="${packageDetail.packageStartDay}">
                                </label>
                                <label for="packageEndDay">
                                    <span>종료일</span>
                                    <input type="date" class="packageEndDay" value="${packageDetail.packageEndDay}">
                                </label>
                                <label for="packageCost">
                                    <span>금액</span>
                                    <input type="text" class="packageCost" value="${packageDetail.packageCost}">
                                </label>
                                <label for="packageMaxpeople">
                                    <span>최대 인원</span>
                                    <input type="number" class="packageMaxpeople" value="${packageDetail.packageMaxpeople}">
                                </label>
                            </div>

                            <div class="package-details">
                                <label for="packageContent">
                                    <span>패키지 내용</span>
                                    <textarea class="package-content">${packageDetail.packageContent}</textarea>
                                </label>
                            </div>

                            <div class="file-attachments">
                                <!-- 해당 패키지 이미지 첨부파일 리스트 동적 추가 -->
                            </div>
                            <div class="attachmentInfo">해당 첨부파일 클릭 시 삭제됩니다.</div>

                            <form class="button-action" style="border: none;">
                                <input type="hidden" name="cityId" value="${packageDetail.cityId}">
                                <input type="hidden" name="packageId" value="${packageDetail.packageId}">
                                <button type="button" class="update-button">
                                    <img src="/img/myPageUpdate.png" alt="board-button" class="board-button">
                                </button>
                            </form>
                        </div>
                    `);

                    const packageCloseButton = packageDetailContainer.querySelector('.close-button');

                    // 패키지 모달 닫기
                    packageCloseButton.addEventListener('click', function() {
                        packageDetailContainer.innerHTML = '';  // 모달 닫기 시 초기화
                        packageDetailContainer.style.display = 'none';
                    });
                })
                .catch(error => {
                    console.error('패키지 상세 정보 로딩 중 오류 발생: ', error);
                    alert('패키지 상세 정보를 불러오는 중 오류가 발생했습니다.');
                });
        }
    });
});

// 기존 getStatusText, getStatusClass 함수 유지
function getStatusText(status) {
    switch (status) {
        case '승인':
            return '승인';
        case '대기':
            return '대기';
        case '미승인':
            return '미승인';
        default:
            return '';
    }
}

function getStatusClass(status) {
    switch (status) {
        case '승인':
            return 'status-approved';
        case '대기':
            return 'status-pending';
        case '미승인':
            return 'status-rejected';
        default:
            return '';
    }
}

// 결제 버튼 모달
    document.addEventListener('DOMContentLoaded', function() {
        // 결제 버튼 이벤트 리스너
        const paymentButton = document.getElementById('package-payment-button');
        const payments = document.querySelector('.paymentList');

        if (paymentButton) {
            paymentButton.addEventListener('click', function () {
                fetch(`payments/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        console.log("결제 내역 서버 응답: ", response);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status} / 결제 정보를 불러올 수 없습니다.`);
                        }
                        return response.json();
                    })
                    .then(paymentData => {
                        console.log("결제 내역 데이터: ", paymentData)
                        const paymentModal = document.getElementById('payment-modal');

                        if(paymentData.length === 0) {
                            payments.innerHTML = '<p>결제 내역이 없습니다.</p>'
                        }

                        // 결제 데이터로 테이블 업데이트
                        payments.innerHTML = paymentData.map(payments => `
                    <div id="payment-modal" class="modal hidden">
                        <div class="modal-content">
                            <div class="modal-header">
                                <span class="close-button">&times;</span>
                                <div class="modal-title">결제 정보</div>

                                <label for="payment-select" id="payment-status">
                                    <select name="payment-select" id="payment-status" class="pay-status-select">
                                        <option value="" selected>전체</option>
                                        <option value="complete">결제 완료</option>
                                        <option value="cancel">결제 취소</option>
                                    </select>
                                </label>

                                <table class="payment-table">
                                    <thead>
                                        <tr class="table-header">
                                            <th>사용자명</th>
                                            <th>패키지명</th>
                                            <th>결제 금액</th>
                                            <th>결제 상태</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>[[${payments.username}]]</td>
                                            <td>[[${payments.packageTitle}]]</td>
                                            <td>[[${payments.totalCost}]]</td>
                                            <td class="pay-status ${getPaymentStatusClass(payments.paymentStatus)}">[[${getPaymentStatusText(payments.paymentStatus)}]]</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `).join('');

                        // 모달 표시
                        if(paymentModal) {
                            paymentModal.style.display = 'block';

                            // 닫기 버튼 이벤트 등록
                            const paymentClose = paymentModal.querySelector('.close-button');
                            paymentClose.addEventListener('click', function () {
                                paymentModal.style.display = 'none';
                            });
                        }

                    })
                    .catch(error => {
                        console.error("결제 정보 로딩 중 오류 발생", error);
                        if(!payments.innerHTML) {
                            payments.innerHTML = '<p>결제 정보를 불러오는 중 오류가 발생했습니다.</p>';
                        }
                    });
            });
        }

// 결제 상태 필터링
        const payStatusSelect = document.querySelector('.pay-status-select');
        if (payStatusSelect) {
            payStatusSelect.addEventListener('change', function () {
                const selectedStatus = this.value;
                const paymentRows = document.querySelectorAll('.payment-table tbody tr');

                paymentRows.forEach(row => {
                    const statusCell = row.querySelector('.pay-status');
                    if (selectedStatus === '' || statusCell.textContent.trim() === selectedStatus) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }

// 상태에 따른 한국어 텍스트 반환하는 함수 추가 -> 결제 상태
        function getPaymentStatusText(status) {
            switch (status) {
                case '결제 완료' :
                    return '결제 완료';
                case '결제 취소' :
                    return '결제 취소';
                default:
                    return '';
            }
        }

// 상태에 따른 CSS 클래스를 반환하는 함수 추가
        function getPaymentStatusClass(status) {
            switch (status) {
                case '결제 완료' :
                    return 'payment-complete';
                case '결제 취소' :
                    return 'payment-cancel';
                default:
                    return '';
            }
        }

// 개인 정보 수정
        document.addEventListener('DOMContentLoaded', function () {
            const userProfile = document.getElementById('profile-icon-Button');
            const profileUpdateModal = document.getElementById('modalOverlay');
            const userInfo = document.querySelector('.userInfo');

            // 날짜 포맷팅 함수
            function formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            // 프로필 수정 모달 열기
            userProfile.addEventListener('click', function () {
                // 사용자 프로필 정보 불러오기
                fetch(`profile/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        console.log("프로필 개인정보 서버 응답: ", response);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status} / 프로필 개인 정보를 불러올 수 없습니다.`);
                        }
                        return response.json();
                    }) // 첫 번째 then 종료
                    .then(user => {
                        userInfo.innerHTML = `
                        <div class="modal hidden" id="businessUpdate-modal">
                                <form th:action="@{/business/profile/{userId}(userId=${user.id})}">
                                    <div class="header">
                                        <span class="close-button">&times;</span>
                                        <h2 class="businessName" th:value="${user.username}"></h2>
                                        <span class="joinDate">가입일 :  ${formatDate(user.regDate)}</span>
                                    </div>
                                    <div class="profile">
                                        <img th:src="@{/img/basicProfile.png}" alt="프로필" class="profile-img">
                                    </div>
                                    <div class="businessInfo">
                                        <label>
                                            <span>기업 ID</span>
                                            <input type="text" th:value="${user.username}" readonly>
                                        </label>
                                    </div>
                                    <div class="businessInfo">
                                        <label>
                                            <span>기업이메일</span>
                                            <input type="email" th:value="${user.email}" readonly>
                                        </label>
                                    </div>
                                    <div class="businessInfo">
                                        <label>
                                            <span>비밀번호</span>
                                            <input type="password" th:utext="${user.password}">
                                        </label>
                                    </div>
                                    <div class="businessInfo">
                                        <label>
                                            <span>새 비밀번호</span>
                                            <input type="re-password" placeholder="새 비밀번호를 입력하세요.">
                                        </label>
                                    </div>
                                    <div class="businessInfo">
                                        <label>
                                            <span>회사 사업자 번호</span>
                                            <input type="text" th:value="${user.companyNumber}" readonly>
                                        </label>
                                    </div>
                    
                                    <div class="actions">
                                        <button type="button" class="update-button" id="update-button">
                                            <img src="/img/myPageUpdate.png" alt="update-button" class="update-button">
                                        </button>
                                        <button type="submit" class="submit-button">
                                            <img src="/img/checkIcon.png" alt="submit-button" class="submit-button">
                                        </button>
                                    </div>
                                </form>
                            </div>
                        `;
                        // 모달 표시
                        profileUpdateModal.style.display = 'block';

                        // 닫기 버튼 이벤트
                        const closeButton = profileUpdateModal.querySelector('.close-button');
                        closeButton.addEventListener('click', function () {
                            profileUpdateModal.classList.add('hidden');
                        });

                        // 수정 버튼 이벤트
                        const updateButton = profileUpdateModal.querySelector('.update-button');
                        const submitButton = profileUpdateModal.querySelector('.submit-button');
                        const newPasswordInput = profileUpdateModal.querySelector('.new-password');

                        updateButton.addEventListener('click', function () {
                            // 수정 가능한 필드 활성화
                            newPasswordInput.disabled = false;
                            submitButton.disabled = false;
                        });

                        // 프로필 제출 버튼 이벤트
                        submitButton.addEventListener('click', function (event) {
                            event.preventDefault();
                            const currentPassword = profileUpdateModal.querySelector('input[type="password"]').value;
                            const newPassword = newPasswordInput.value;

                            const formData = new FormData();
                            formData.append('currentPassword', currentPassword);
                            formData.append('newPassword', newPassword);

                            fetch(`profile/${userId}`, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(Object.fromEntries(formData))
                            })
                                .then(response => {
                                    console.log("프로필 수정 서버 응답: ", response);
                                    if (!response.ok) {
                                        throw new Error('프로필 업데이트 실패');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    alert('프로필이 성공적으로 업데이트되었습니다.');
                                    profileUpdateModal.classList.add('hidden');
                                })
                                .catch(error => {
                                    console.error('프로필 업데이트 오류:', error);
                                    alert('프로필 업데이트 중 오류가 발생했습니다.');
                                });
                        });
                    })
                    .catch(error => {
                        console.error('프로필 정보 로드 오류:', error);
                        alert('프로필 정보를 불러올 수 없습니다.');
                    });
            });
        });

// 모달 외부 닫기
        document.addEventListener('DOMContentLoaded', function () {
            // 모달 외부 닫기 공통
            const modals = document.querySelectorAll('.modal, .businessUpdate-modal, .package-modal');

            window.addEventListener('click', function (event) {
                modals.forEach(modal => {
                    if (event.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            });
        })

// 홈버튼 클릭 시 이동
        document.addEventListener('DOMContentLoaded', function () {
            // 홈버튼 클릭 시 해당 홈으로 이동 url
            const homeLogoButton = document.querySelector('.homeLogo-Button');
            if (homeLogoButton) {
                homeLogoButton.addEventListener('click', function () {
                    window.location.href = '/'; // 홈페이지로 이동
                });
            }
        })
    })

