// gist

export interface TokenPayload {
  files: Files;
  description: string;
  public: boolean;
}

interface Files {
  'tokens.txt': Tokens;
}

interface Tokens {
  content: string;
}

export interface GistResponse {
  html_url: string;
  id: string;
}

// cf

export interface CFMetadataResponse {
  result: {
    id: string;
  };
}