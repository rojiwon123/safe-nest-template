import { Configuration } from "@APP/infrastructure/config";
import { ErrorCode } from "@APP/types/ErrorCode";
import { Failure } from "@APP/utils/failure";
import { fetch } from "@APP/utils/fetch";
import { Result } from "@APP/utils/result";

export namespace KakaoSDK {
    const AUTH_URL = "https://kauth.kakao.com";
    const API_URL = "https://kapi.kakao.com";

    export interface IOauth2Options {
        /**
         * 앱 REST API 키
         *
         * [내 애플리케이션] > [앱 키]에서 확인 가능
         */
        readonly client_id: string;
        /**
         * 토큰 발급 시, 보안을 강화하기 위해 추가 확인하는 코드
         *
         * [내 애플리케이션] > [보안]에서 설정 가능
         *
         * ON 상태인 경우 필수 설정해야 함
         */
        readonly client_secret?: string;
        /**
         * 인가 코드를 전달받을 서비스 서버의 URI
         */
        readonly redirect_uri: string;
        /**
         * 동의 화면 요청 시 추가 상호작용을 요청하고자 할 때 전달하는 파라미터
         *
         * 다음 값 사용 가능:
         *
         * login: 기존 사용자 인증 여부와 상관없이 사용자에게 카카오계정 로그인 화면을 출력하여 다시 사용자 인증을 수행하고자 할 때 사용, 카카오톡 인앱 브라우저에서는 이 기능이 제공되지 않음
         *
         * none: 사용자에게 동의 화면과 같은 대화형 UI를 노출하지 않고 인가 코드 발급을 요청할 때 사용, 인가 코드 발급을 위해 사용자의 동작이 필요한 경우 에러 응답 전달
         *
         * create: 사용자에게 카카오계정 신규 가입 후 로그인하도록 하기 위해 사용, 카카오계정 가입 페이지로 이동 후, 카카오계정 가입 완료 후 동의 화면 출력
         */
        readonly prompt?: "login" | "none" | "create";
        /**
         * 약관 선택해 동의 받기 요청 시 사용
         *
         * 동의받을 약관 태그 목록
         *
         * 약관 태그는 [내 애플리케이션] > [간편가입]에서 확인 가능
         */
        readonly service_terms: string[];
        /**
         * 카카오 로그인 과정 중 동일한 값을 유지하는 임의의 문자열(정해진 형식 없음)
         *
         * Cross-Site Request Forgery(CSRF) 공격으로부터 카카오 로그인 요청을 보호하기 위해 사용
         *
         * 각 사용자의 로그인 요청에 대한 state 값은 고유해야 함
         *
         * 인가 코드 요청, 인가 코드 응답, 토큰 발급 요청의 state 값 일치 여부로 요청 및 응답 유효성 확인 가능
         */
        readonly state?: string;
        /**
         * OpenID Connect를 통해 ID 토큰을 함께 발급받을 경우, ID 토큰 재생 공격을 방지하기 위해 사용
         *
         * ID 토큰 유효성 검증 시 대조할 임의의 문자열(정해진 형식 없음)
         */
        readonly nonce?: string;
    }

    const options: IOauth2Options = {
        client_id: Configuration.KAKAO_CLIENT_ID,
        client_secret: Configuration.KAKAO_CLIENT_SECRET,
        redirect_uri: Configuration.KAKAO_REDIRECT_URI,
        service_terms: [],
        prompt: "login",
    };

    /**
     * Get Url for {@link https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code 인가 코드 받기}
     */
    export const getUrlForAuthorize = (): string =>
        `${AUTH_URL}/oauth/authorize?${new URLSearchParams({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            ...(options.prompt ? { prompt: options.prompt } : {}),
            ...(options.service_terms.length > 0
                ? { service_terms: options.service_terms.join(",") }
                : {}),
            ...(options.state ? { state: options.state } : {}),
            ...(options.nonce ? { nonce: options.nonce } : {}),
            response_type: "code",
        }).toString()}`;

    export interface ITokens {
        /**
         * 토큰 타입, bearer로 고정
         */
        readonly token_type: "bearer";
        /**
         * 사용자 액세스 토큰 값
         */
        readonly access_token: string;
        /**
         * ID 토큰 값
         *
         * OpenID Connect 확장 기능을 통해 발급되는 ID 토큰, Base64 인코딩 된 사용자 인증 정보 포함
         *
         * 제공 조건: OpenID Connect가 활성화 된 앱의 토큰 발급 요청인 경우
         *
         * 또는 scope에 openid를 포함한 추가 항목 동의 받기 요청을 거친 토큰 발급 요청인 경우
         */
        readonly id_token?: string;
        /**
         * 액세스 토큰과 ID 토큰의 만료 시간(초)
         *
         * 참고: 액세스 토큰과 ID 토큰의 만료 시간은 동일
         */
        readonly expires_in: number;
        /**
         * 사용자 리프레시 토큰 값
         */
        readonly refresh_token: string;
        /**
         * 리프레시 토큰 만료 시간(초)
         */
        readonly refresh_token_expires_in: number;
        /**
         * 인증된 사용자의 정보 조회 권한 범위
         *
         * 범위가 여러 개일 경우, 공백으로 구분
         *
         * 참고: OpenID Connect가 활성화된 앱의 토큰 발급 요청인 경우, ID 토큰이 함께 발급되며 scope 값에 openid 포함
         */
        readonly scope?: string;
    }

    /**
     * {@link https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token 토큰 받기}
     */
    export const getToken = async (
        code: string,
    ): Promise<Result<ITokens, Failure.Internal<ErrorCode.Authentication>>> => {
        try {
            return Result.Ok.map(
                await fetch<string, ITokens>(
                    {
                        host: AUTH_URL,
                        headers: {
                            "User-Agent": "request",
                            "Content-Type":
                                "application/x-www-form-urlencoded;charset=utf-8",
                        },
                    },
                    {
                        method: "POST",
                        path: "/oauth/token",
                        status: 200,
                        request: {
                            type: "text/plain",
                            encrypted: false,
                        },
                        response: {
                            type: "application/json",
                            encrypted: false,
                        },
                    },
                    new URLSearchParams({
                        grant_type: "authorization_code",
                        client_id: options.client_id,
                        redirect_uri: options.redirect_uri,
                        code,
                        ...(options.client_secret
                            ? { client_secret: options.client_secret }
                            : {}),
                    }).toString(),
                ),
            );
        } catch {
            return Result.Error.map(
                new Failure.Internal("AUTHENTICATION_FAIL"),
            );
        }
    };

    export interface IMeRequestParameter {
        /**
         * 이미지 URL 값 HTTPS 여부, true 설정 시 HTTPS 사용, 기본 값 false
         */
        readonly secure_resource?: boolean;
        /**
         * Property 키 목록, JSON Array를 ["kakao_account.email"]과 같은 형식으로 사용
         */
        readonly property_keys: PropertyKey[];
    }

    /**
     * {@link https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info 사용자 기본 정보 가져오기}
     */
    export const getUser =
        (parameter: IMeRequestParameter) =>
        async (
            access_token: string,
        ): Promise<
            Result<IGetUserResponse, Failure.Internal<ErrorCode.Authentication>>
        > => {
            try {
                return Result.Ok.map(
                    await fetch<IGetUserResponse>(
                        {
                            host: API_URL,
                            headers: {
                                "User-Agent": "request",
                                Authorization: `Bearer ${access_token}`,
                                "Content-type":
                                    "application/x-www-form-urlencoded;charset=utf-8",
                            },
                        },
                        {
                            method: "GET",
                            path: `/v2/user/me?${new URLSearchParams({
                                secure_resource:
                                    (parameter.secure_resource ?? true) + "",
                                property_keys: JSON.stringify(
                                    parameter.property_keys,
                                ),
                            })}`,
                            request: null,
                            response: {
                                type: "application/json",
                                encrypted: false,
                            },
                            status: 200,
                        },
                    ),
                );
            } catch {
                return Result.Error.map(
                    new Failure.Internal("AUTHENTICATION_FAIL"),
                );
            }
        };

    export interface IIdTokenPayload {
        /**
         * ID 토큰을 발급한 인증 기관 정보
         *
         * https://kauth.kakao.com로 고정
         */
        readonly iss: "https://kauth.kakao.com";
        /**
         * ID 토큰이 발급된 앱의 앱 키
         *
         * 인가 코드 받기 요청 시 client_id에 전달된 앱 키
         *
         * Kakao SDK를 통한 카카오 로그인의 경우, 해당 SDK 초기화 시 사용된 앱 키
         */
        readonly aud: string;
        /**
         * ID 토큰에 해당하는 사용자의 회원번호
         */
        readonly sub: string;
        /**
         * ID 토큰 발급 또는 갱신 시각, UNIX 타임스탬프(Timestamp)
         */
        readonly iat: number;
        /**
         * ID 토큰 만료 시간, UNIX 타임스탬프(Timestamp)
         */
        readonly exp: number;
        /**
         * 사용자가 카카오 로그인을 통해 인증을 완료한 시각, UNIX 타임스탬프(Timestamp)
         */
        readonly auth_time: number;
        /**
         * 인가 코드 받기 요청 시 전달한 nonce 값과 동일한 값
         *
         * ID 토큰 유효성 검증 시 사용
         */
        readonly nonce?: string;
        /**
         * 닉네임
         *
         * 사용자 정보 가져오기의 kakao_account.profile.nickname에 해당
         *
         * 필요한 동의 항목: 프로필 정보(닉네임/프로필 사진) 또는 닉네임
         */
        readonly nickname?: string;
        /**
         * 프로필 미리보기 이미지 URL
         *
         * 110px * 110px 또는 100px * 100px
         *
         * 사용자 정보 가져오기의 kakao_account.profile.thumbnail_image_url에 해당
         *
         * 필요한 동의 항목: 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진
         */
        readonly picture?: string;
        /**
         * 카카오계정 대표 이메일
         *
         * 사용자 정보 가져오기의 kakao_account.email에 해당
         *
         * 필요한 동의 항목: 카카오계정(이메일)
         *
         * 비고: ID 토큰 페이로드의 이메일은 유효하고 인증된 이메일 값이 있는 경우에만 제공, 이메일 사용 시 주의사항 참고
         * @format email
         */
        readonly email?: string;
    }

    export type PropertyKey =
        | "kakao_account.profile"
        | "kakao_account.name"
        | "kakao_account.email"
        | "kakao_account.age_range"
        | "kakao_account.birthday"
        | "kakao_account.gender";

    export interface IGetUserResponse {
        /**
         * 회원번호
         */
        readonly id: number;
        /**
         * 자동 연결 설정을 비활성화한 경우만 존재
         *
         * 연결하기 호출의 완료 여부
         * - false: 연결 대기(Preregistered) 상태
         * - true: 연결(Registered) 상태
         */
        readonly has_signed_up?: boolean;
        /**
         * 서비스에 연결 완료된 시각, UTC*
         *
         * yyyyMMddHHmmss 형식의 String
         * @foramt date-time
         */
        readonly connected_at?: string;
        /**
         * 카카오싱크 간편가입을 통해 로그인한 시각, UTC*
         *
         * yyyyMMddHHmmss 형식의 String
         * @foramt date-time
         */
        readonly synched_at?: string;
        /**
         * 사용자 프로퍼티(Property)
         *
         * 사용자 프로퍼티 참고
         */
        readonly properties?: object;
        /**
         * 카카오계정 정보
         */
        readonly kakao_account?: IKakaoAccount;
        /**
         * uuid 등 추가 정보
         */
        readonly for_partner?: IPartner;
    }

    export interface IPartner {
        /**
         * 고유 ID
         *
         * 카카오톡 메시지 API 사용 권한이 있는 경우에만 제공
         *
         * 필요한 동의 항목: 카카오톡 메시지 전송(talk_message)
         * @format uuid
         */
        readonly uuid?: string;
    }

    export interface IKakaoAccount {
        /**
         * 사용자 동의 시 프로필 정보(닉네임/프로필 사진) 제공 가능
         *
         * 필요한 동의 항목: 프로필 정보(닉네임/프로필 사진)
         */
        readonly profile_needs_agreement?: boolean;
        /**
         * 사용자 동의 시 닉네임 제공 가능
         *
         * 필요한 동의 항목: 닉네임
         */
        readonly profile_nickname_needs_agreement?: boolean;
        /**
         * 사용자 동의 시 프로필 사진 제공 가능
         *
         * 필요한 동의 항목: 프로필 사진
         */
        readonly profile_image_needs_agreement?: boolean;
        /**
         * 프로필 정보
         *
         * 필요한 동의 항목: 프로필 정보(닉네임/프로필 사진), 닉네임, 프로필 사진
         */
        readonly profile?: IProfile;
        /**
         * 사용자 동의 시 카카오계정 이름 제공 가능
         *
         * 필요한 동의 항목: 이름
         */
        readonly name_needs_agreement?: boolean;
        /**
         * 카카오계정 이름
         *
         * 필요한 동의 항목: 이름
         */
        readonly name?: string;
        /**
         * 사용자 동의 시 카카오계정 대표 이메일 제공 가능
         *
         * 필요한 동의 항목: 카카오계정(이메일)
         */
        readonly email_needs_agreement?: boolean;
        /**
         * 이메일 유효 여부
         * - true: 유효한 이메일
         * - false: 이메일이 다른 카카오계정에 사용돼 만료
         *
         * 필요한 동의 항목: 카카오계정(이메일)
         */
        readonly is_email_valid?: boolean;
        /**
         * 이메일 인증 여부
         * - true: 인증된 이메일
         * - false: 인증되지 않은 이메일
         *
         * 필요한 동의 항목: 카카오계정(이메일)
         */
        readonly is_email_verified?: boolean;
        /**
         * 카카오계정 대표 이메일
         *
         * 필요한 동의 항목: 카카오계정(이메일)
         *
         * 비고: 이메일 사용 시 주의사항
         * @format email
         */
        readonly email?: string;
        /**
         * 사용자 동의 시 연령대 제공 가능
         *
         * 필요한 동의 항목: 연령대
         */
        readonly age_range_needs_agreement?: boolean;
        /**
         * 연령대
         * - 1~9: 1세 이상 10세 미만
         * - 10~14: 10세 이상 15세 미만
         * - 15~19: 15세 이상 20세 미만
         * - 20~29: 20세 이상 30세 미만
         * - 30~39: 30세 이상 40세 미만
         * - 40~49: 40세 이상 50세 미만
         * - 50~59: 50세 이상 60세 미만
         * - 60~69: 60세 이상 70세 미만
         * - 70~79: 70세 이상 80세 미만
         * - 80~89: 80세 이상 90세 미만
         * - 90~: 90세 이상
         *
         * 필요한 동의 항목: 연령대
         * @format ^(1~9)|(10~14)|(15~19)|(20~29)|(30~39)|(40~49)|(50~59)|(60~69)|(70~79)|(80~89)|(90~)$
         */
        readonly age_range?: string;
        /**
         * 사용자 동의 시 출생 연도 제공 가능
         *
         * 필요한 동의 항목: 출생 연도
         */
        readonly birthyear_needs_agreement?: boolean;
        /**
         * 출생 연도(YYYY 형식)
         *
         * 필요한 동의 항목: 출생 연도
         */
        readonly birthyear?: string;
        /**
         * 사용자 동의 시 생일 제공 가능
         *
         * 필요한 동의 항목: 생일
         */
        readonly birthday_needs_agreement?: boolean;
        /**
         * 생일(MMDD 형식)
         *
         * 필요한 동의 항목: 생일
         */
        readonly birthday?: string;
        /**
         * 생일 타입
         * SOLAR(양력) 또는 LUNAR(음력)
         *
         * 필요한 동의 항목: 생일
         */
        readonly birthday_type?: "SOLAR" | "LUNAR";
        /**
         * 사용자 동의 시 성별 제공 가능
         *
         * 필요한 동의 항목: 성별
         */
        readonly gender_needs_agreement?: boolean;
        /**
         * 성별
         * - female: 여성
         * - male: 남성
         *
         * 필요한 동의 항목: 성별
         */
        readonly gender?: "female" | "male";
        /**
         * 사용자 동의 시 전화번호 제공 가능
         *
         * 필요한 동의 항목: 카카오계정(전화번호)
         */
        readonly phone_number_needs_agreement?: boolean;
        /**
         * 카카오계정의 전화번호
         *
         * 국내 번호인 경우 +82 00-0000-0000 형식
         *
         * 해외 번호인 경우 자릿수, 붙임표(-) 유무나 위치가 다를 수 있음
         *
         * (참고: libphonenumber)
         *
         * 필요한 동의 항목: 카카오계정(전화번호)
         */
        readonly phone_number?: string;
        /**
         * 사용자 동의 시 CI 참고 가능
         *
         * 필요한 동의 항목: CI(연계정보)
         */
        readonly ci_needs_agreement?: boolean;
        /**
         * 연계정보
         *
         * 필요한 동의 항목: CI(연계정보)
         */
        readonly ci?: string;
        /**
         * CI 발급 시각, UTC*
         *
         * 필요한 동의 항목: CI(연계정보)
         */
        readonly ci_authenticated_at?: string;
    }

    export interface IProfile {
        /**
         * 닉네임
         *
         * 필요한 동의 항목: 프로필 정보(닉네임/프로필 사진) 또는 닉네임
         */
        readonly nickname?: string;
        /**
         * 프로필 미리보기 이미지 URL
         *
         * 110px * 110px 또는 100px * 100px
         *
         * 필요한 동의 항목: 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진
         */
        readonly thumbnail_image_url?: string;
        /**
         * 프로필 사진 URL
         *
         * 640px * 640px 또는 480px * 480px
         *
         * 필요한 동의 항목: 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진
         */
        readonly profile_image_url?: string;
        /**
         * 프로필 사진 URL이 기본 프로필 사진 URL인지 여부
         * 사용자가 등록한 프로필 사진이 없을 경우, 기본 프로필 사진 제공
         * true: 기본 프로필 사진
         * false: 사용자가 등록한 프로필 사진
         *
         * 필요한 동의 항목: 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진
         */
        readonly is_default_image?: boolean;
    }
}
