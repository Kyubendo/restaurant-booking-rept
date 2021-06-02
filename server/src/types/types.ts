export type requestStatus = 'pending' | 'processing' | 'accepted' | 'rejected'
export type userRole = 'client' | 'admin'
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