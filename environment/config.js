var appConfig = {
    API_HOST: "https://paywith.paytm.com/api/",
    APP_HOST: "https://paywith.paytm.com/",
    PAYMENT_BUTTON_HOST: "<%= PAYMENT_BUTTON_HOST %>",
    OAUTH_CLIENT_ID: "<%= OAUTH_CLIENT_ID %>",
    OAUTH_HOST: "<%= OAUTH_HOST %>",
    OAUTH_REDIRECT_URI: "<%= OAUTH_REDIRECT_URI %>",
    PAY_BUTTON_URL: "<%= PAY_BUTTON_URL %>"

};
// var appConfig = {
//     API_HOST: "<%= API_HOST %>",
//     APP_HOST: "<%= APP_HOST %>",
//     PAYMENT_BUTTON_HOST: "<%= PAYMENT_BUTTON_HOST %>",
//     OAUTH_CLIENT_ID: "<%= OAUTH_CLIENT_ID %>",
//     OAUTH_HOST: "<%= OAUTH_HOST %>",
//     OAUTH_REDIRECT_URI: "<%= OAUTH_REDIRECT_URI %>",
//     PAY_BUTTON_URL: "<%= PAY_BUTTON_URL %>"
// };
var appConstants = {
    USER_LOGIN: "core/seller/get-oauth-token-using-password/",
    USER_SIGNUP: "core/seller/register-user/",
    USER_FORGOT_PASSWORD: "oauth-api/forgetPass",
    USER_WALLET_BALANCE: "core/wallet/get-wallet-balance/",
    GET_OAUTH_TOKEN: "core/seller/get-oauth-token/",
    UPDATE_SELLER: "core/seller/update-seller/",
    GET_MERCHANDISE_INFO: "dg/merchandise/get-merchandise-info/",
    GET_ALL_MERCHANDISE: "dg/merchandise/get-all-merchandise/",
    START_TRANSACTION: "dg/checkouts/start-transaction/",
    SET_MERCHANDISE_STATE: "dg/merchandise/set-merchandise-state/",
    SEND_INVITE: "dg/merchandise/send-invites/",
    RESEND_MERCHANDISE: "dg/checkouts/resend-merchandise/",
    ALL_ORDERS: "core/get-all-transactions/",
    UPDATE_MERCHANDISE: "dg/merchandise/update-merchandise/",
    CREATE_MERCHANDISE: "dg/merchandise/create-merchandise/",
    FINISH_TRANSACTION: "dg/checkouts/finish-transaction/",
    CHECK_TRANSACTION_STATUS: "dg/checkouts/check-transaction-status/",
    CREATE_BUTTON: "core/button/create/",
    UPDATE_BUTTON: "core/button/update/",
    BUTTON_LIST: "core/button/",
    BUTTON_START_TRANSACTION: "/core/button/start-transaction/",
    BUTTON_FINISH_TRANSACTION: "/core/button/finish-transaction/"
};