import { Regex } from "@/util/regex";

export type SignInInput = SignInInput.None | SignInInput.OTP | SignInInput.Passkey;

export namespace SignInInput {
    export interface None {
        mfa_method: "none";
        user_code: string;
    }
    export interface OTP {
        mfa_method: "otp";
        verification_code: string;
        otp_code: string;
    }
    export interface Passkey {
        mfa_method: "passkey";
        verification_code: string;
        response: object;
    }
}

export interface SignUpInput extends Pick<SignInInput.None, "user_code"> {
    username: string;
}

export interface Token {
    token: string;
    expired_at: Regex.DateTime;
}

export interface UserTokens {
    access_token: Token;
    refresh_token: Token;
}

export interface RefreshToken {
    refresh_token: string;
}

export interface VerifyOAuthCode {
    provider: "kakao" | "google" | "github";
    oauth_code: string;
    redirect_uri: Regex.URI;
}

export interface UserCode {
    user_code: string;
    use_mfa: boolean;
    /**
     * 회원 상태에 따라 user code로 할 수 있는 동작이 다르다.
     *
     * - guest: 회원가입
     * - active: user token 발급
     */
    user_status: "guest" | "active" | "inactive" | "banned";
}
