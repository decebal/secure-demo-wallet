import type {ActionResponse} from 'next-safe-action'

export interface VerificationResponse extends ActionResponse {
    success: boolean
    error?: string
}
