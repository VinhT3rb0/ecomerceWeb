package org.do_an.be.dtos;
import lombok.*;
@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class MailStructure {
    private String subject;
    private String message;
}
