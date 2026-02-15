

class QueryParams {
    endpoint: string;
    expand: string;
    headers: Map<string, string>;

    constructor(endpoint: string, expand: string, headers: Map<string, string>) {
        this.endpoint = endpoint;
        this.expand = expand;
        this.headers = headers;
    }
}   