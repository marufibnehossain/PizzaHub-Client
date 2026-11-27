export interface ImgBBResponse {
    success: boolean;
    status: number;
    data?: {
        id: string;
        url: string;
        display_url: string;
        delete_url: string;
    };
    error?: {
        message: string;
    };
}

export interface ImageUploadResponse {
    success: boolean;
    message: string;
    data?: {
        url: string;
    };
}