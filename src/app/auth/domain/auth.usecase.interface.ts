import { Effect } from "effect/Effect";

import { RefreshToken, SignInInput, SignUpInput, UserCode, UserTokens, VerifyOAuthCode } from "@/app/auth/presentation/auth.dto";
import { Err } from "@/common/err";
import { AuthErr } from "@/common/err/code/auth.code";

export interface IAuthUsecase {
    signUp(input: SignUpInput): Effect<UserTokens, Err<AuthErr.AlreadyUser> | Err<AuthErr.UserCodeInvalid>>;
    signIn(input: SignInInput): Effect<UserTokens, Err<AuthErr.NotUser> | Err<AuthErr.UserCodeInvalid> | Err<AuthErr.MFAFail>>;
    signOut(input: RefreshToken): Effect<void, Err<AuthErr.TokenInvalid> | Err<AuthErr.TokenExpired>>;
    refreshUserToken(input: RefreshToken): Effect<UserTokens, Err<AuthErr.TokenInvalid> | Err<AuthErr.TokenExpired>>;
    // authenticate e.g. kakao, google
}

export interface IOAuthUsecase {
    verify(input: VerifyOAuthCode): Effect<UserCode>;
}

// export interface IOTPUsecase {
//     registOTP(): Effect<void>;
//     verify(): Effect<void>;
//     qrCode(): Effect<(res: Response) => Promise<void>>;
// }
