package com.codeassess.dto.user;

import com.codeassess.dto.subscription.SubscriptionDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String subjectPreference;
    private String profilePictureUrl;
    private SubscriptionDto subscription;
    private LocalDateTime createdAt;
}
