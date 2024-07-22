package org.do_an.be.responses.comment;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.do_an.be.entity.Comment;
import org.do_an.be.responses.user.UserResponse;
import org.do_an.be.responses.BaseResponse;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentResponse extends BaseResponse {
    @JsonProperty("id")
    private Integer id;

    @JsonProperty("content")
    private String content;

    //user's information
    //@JsonProperty("user_id")
    //private Long userId;

    @JsonProperty("user")
    private UserResponse user;

    @JsonProperty("product_id")
    private Integer productId;

    //@JsonProperty("created_at")
    //private LocalDateTime createdAt;
    //private String createdAt;//iso string

    public static CommentResponse fromComment(Comment comment) {
        UserResponse userResponse = UserResponse.fromUser(comment.getUser());
        CommentResponse result = CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .user(userResponse)
                //.userId(comment.getUser().getId())
                .productId(comment.getProduct().getId())
                //.userResponse(UserResponse.fromUser(comment.getUser()))
                //.createdAt(comment.getCreatedAt())
                .build();
        result.setCreatedAt(comment.getCreatedAt());
        return result;
    }
}
