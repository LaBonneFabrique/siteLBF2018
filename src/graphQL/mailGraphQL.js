import gql from 'graphql-tag'

export const ENVOI_MAIL = gql`
mutation envoiMail(
    $tag: String!
    $from: String!
    $to: [String!]!
    $subject: String!
    $html: String!) {
        sendMailgunEmail(
            tag: $tag
            from: $from
            to: $to
            subject: $subject
            html: $html
          ) {
            success
          }
        }
`

export const ENVOI_MAIL_RV = gql`
mutation envoiMail(
    $tag: String!
    $from: String!
    $to: [String!]!
    $subject: String!
    $html: String!
    $recipientVariables: Json) {
        sendMailgunEmail(
            tag: $tag
            from: $from
            to: $to
            subject: $subject
            html: $html
            recipientVariables: $recipientVariables
          ) {
            success
          }
        }
`
