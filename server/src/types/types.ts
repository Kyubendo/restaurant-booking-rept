export type requestStatus = 'pending' | 'processing' | 'accepted' | 'rejected'
export type UserRole = 'client' | 'admin'
export type zone = 'common' | 'children' | 'smoking'

export type FilterOptions = {
    tableId: number,
    time: string,
    zone?: zone,
}

export type Table = {
    id: number,
    chair_count: number,
    zone: zone,
    reserved_time: string,
}

export type Request = {
    id: number,
    user_id: number,
    table_id: number,
    time: string,
    status: requestStatus
}

export type UserAuth = {
    token: string
    role: UserRole
    name: string
}