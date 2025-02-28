package com.lec.spring.mytrip.domain.attachment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardAttachment {
    private int boardAttachmentId; // 첨부파일 ID
    private int boardId;           // 게시글 ID
    private String fileName;        // 첨부파일 이름
}
