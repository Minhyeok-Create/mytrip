document.addEventListener('DOMContentLoaded', function () {
    console.log("JavaScript Loaded");

    let previouslyFocusedElement = null;

    // 모달 요소 가져오기
    const modal = document.getElementById('exampleModal');

    // 모달 열기 이벤트
    modal.addEventListener('show.bs.modal', () => {
        console.log("Modal is opening...");
        previouslyFocusedElement = document.activeElement; // 현재 포커스된 요소 저장
        modal.removeAttribute('aria-hidden');
        modal.removeAttribute('inert');
    });

    // 모달 닫기 이벤트
    modal.addEventListener('hide.bs.modal', () => {
        console.log("Modal is closing...");
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('inert', '');
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    });

    // 테이블 내 버튼 클릭 이벤트 처리
    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains('board-details-button')) {
            console.log("board details button clicked:", event.target);

            // 데이터 가져오기
            const boardId = event.target.getAttribute('data-boardId');
            const modalBoardIdElement = document.getElementById('modalBoardId');

            console.log("Fetching attachments for boardId:", boardId);

            // modalBoardId에 Board ID 설정
            if (modalBoardIdElement) {
                modalBoardIdElement.setAttribute('data-boardId', boardId);
                console.log("modalBoardId updated with boardId:", boardId);
            } else {
                console.error("Element with ID 'modalBoardId' not found.");
                return;
            }

            // 이미지 컨테이너 초기화
            const imageContainer = document.getElementById('imageContainer');
            imageContainer.innerHTML = '';

            // 첨부파일 가져오기
            fetch(`/admin/boardAttachments/${boardId}`)
                .then((response) => response.json())
                .then((attachments) => {
                    if (attachments && attachments.length > 0) {
                        attachments.forEach((attachment) => {
                            const img = document.createElement('img');
                            img.src = `/uploads/${attachment.fileName.trim()}`;
                            img.alt = '첨부 이미지';
                            imageContainer.appendChild(img);
                        });
                    } else {
                        imageContainer.innerHTML = '<p>첨부파일이 없습니다.</p>';
                    }
                })
                .catch((error) => {
                    console.error("Error fetching attachments:", error);
                    alert("첨부파일 정보를 불러오지 못했습니다.");
                });

            // 모달 데이터 설정
            const regDate = event.target.getAttribute('data-date')?.split('T')[0] || '[데이터 없음]';
            const boardSubject = event.target.getAttribute('data-subject') || '[데이터 없음]';
            const boardContent = event.target.getAttribute('data-content') || '[데이터 없음]';
            const boardViewCount = event.target.getAttribute('data-viewCount') || '[데이터 없음]';
            const boardCityName = event.target.getAttribute('data-cityName') || '[데이터 없음]';
            const boardUserName = event.target.getAttribute('data-userName') || '[데이터 없음]';


            // HTML 데이터를 DOM으로 변환
            const parser = new DOMParser();
            const doc = parser.parseFromString(boardContent, 'text/html');

            // 텍스트와 이미지 분리
            const textContent = doc.body.textContent.trim(); // 텍스트 추출
            const imageElements = doc.querySelectorAll('img'); // 이미지 요소 추출

            // 이미지 정보를 배열로 저장
            const images = Array.from(imageElements).map(img => ({
                src: img.getAttribute('src'), // 이미지 데이터 (Base64)
                filename: img.getAttribute('data-filename'), // 파일 이름
                style: img.getAttribute('style') // 스타일 정보
            }));

            // 결과 출력
            console.log("텍스트:", textContent);
            console.log("이미지:", images);

            document.getElementById('modalRegDate').textContent = regDate;
            document.getElementById('modalBoardSubject').textContent = boardSubject;
            document.getElementById('modalBoardContent').innerHTML = textContent;
            document.getElementById('modalBoardViewCount').textContent = boardViewCount;
            document.getElementById('modalBoardCityName').textContent = boardCityName;
            document.getElementById('modalBoardUserName').textContent = boardUserName;

            images.forEach(image => {
                const imgElement = document.createElement("img");
                imgElement.src = image.src;
                imgElement.alt = image.filename; // 이미지 파일 이름
                imgElement.style.height = '200px';
                imgElement.style.width = 'auto';
                imgElement.style.objectFit = 'contain';

                // 이미지 컨테이너에 추가
                imageContainer.appendChild(imgElement);
            });
        }
    });

    window.deletePost = function () {
        const modalBoardIdElement = document.getElementById('modalBoardId');
        console.log('modalBoardId에 뭐가 들어올까?? :', modalBoardIdElement);
        if (!modalBoardIdElement) {
            console.error("Element with ID 'modalBoardId' not found.");
            alert("삭제하려는 게시물 정보를 찾을 수 없습니다.");
            return;
        }

        const boardId = modalBoardIdElement.getAttribute('data-boardId');
        if (!boardId) {
            console.error("Board ID not found.");
            alert("삭제하려는 게시물 ID를 찾을 수 없습니다.");
            return;
        }

        if (confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
            console.log("Deleting board with ID:", boardId);
            fetch('/admin/deletePost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ boardId }),
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Board deleted successfully.');
                        alert('성공적으로 게시물이 삭제되었습니다.')
                        location.reload(); // 테이블 새로고침
                    } else {
                        console.error('Failed to delete board. Server response status:', response.status);
                        alert('게시물 삭제에 실패했습니다.');
                    }
                })
                .catch((error) => {
                    console.error('Error deleting board:', error);
                    alert('게시물 삭제 중 오류가 발생했습니다.');
                });
        }
    };

    // 슬라이더 초기화
    const sliderContainer = document.getElementById('sliderContainer');
    const imageContainer = document.getElementById('imageContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentIndex = 0;

    function showSlide(index) {
        const images = imageContainer.querySelectorAll('img');
        if (images.length === 0) return;

        if (index < 0) {
            currentIndex = images.length - 1;
        } else if (index >= images.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        const offset = -currentIndex * sliderContainer.clientWidth;
        imageContainer.style.transform = `translateX(${offset}px)`;
    }

    prevBtn.addEventListener('click', function () {
        showSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function () {
        showSlide(currentIndex + 1);
    });

    // 첫 번째 슬라이드 표시
    showSlide(currentIndex);

    function reloadTable() {
        location.reload();
    }
});
