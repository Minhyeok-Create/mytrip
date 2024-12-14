package com.lec.spring.mytrip.repository;

import com.lec.spring.mytrip.domain.City;
import com.lec.spring.mytrip.domain.Feed;
import com.lec.spring.mytrip.domain.PostAttachment;

import java.util.List;

public interface FeedRepository {
    // 새 피드 작성 INSERT
    int save(Feed feed);

    // 특정 피드 id 글 내용 읽기
    Feed findById(int id);

    // 특정 id 글 조회수 증가
    int viewCnt(int id);

    // 전체 글 목록 : 최신순
    List<Feed> findAll();

    // 가장 최근 게시물 9개 개인정보 오른쪽 페이지에 배치
    int findRecentFeedByUser(int id);

    // 특정 피드 id 피드 수정 -> 모달에서 처리
    int update(Feed feed);

    // 특정 피드 id 피드 삭제 -> 모달에서 처리
    int delete(int id);

    // 전체 피드 개수
    int feedCountAll();

    // 첨부파일 저장
    int saveAttachment(PostAttachment attachment);

    // 특정 피드 ID로 첨부파일 찾기
    List<PostAttachment> findAttachmentByBoardId(int boardId);

    // 첨부파일 삭제
    int deleteAttachment(int boardAttachmentId);

    // 특정 피드 ID의 첨부파일 삭제
    int deleteAttachmentByBoardId(int boardId);

    // 도시
    List<City> findAllCities();

    City findCityById(Long id);

    //도시와 카테고리 별 피드
    List<Feed> findByCityAndCategory(int cityId, String category);

}
