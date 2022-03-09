interface Payload {
  template_id: string;
  username: string;
  password: string;
  font?: string;
  max_font_size?: string;
  boxes: Box[];
}

interface Box {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  outline_color: string;
}