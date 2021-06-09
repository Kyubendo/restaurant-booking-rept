export type RequestStatus = 'pending' | 'processing' | 'accepted' | 'rejected'
export type UserRole = 'client' | 'admin'
export type Zone = 'common' | 'children' | 'smoking'

export type FilterOptions = {
    tableId: number,
    time: string,
    zone?: Zone,
}

export type Table = {
    id: number,
    max_chair_count: number,
    zone: Zone,
    reserved_time: string,
}

export type TablesStatusInfo = {
    id: number,
    time: string,
    status: RequestStatus
}

export type Request = {
    id: number,
    user_id: number,
    table_id: number,
    time: string,
    status: RequestStatus,
    user_name: string,
    user_phone: string
}

export type UserAuth = {
    token: string
    role: UserRole
    name: string
}