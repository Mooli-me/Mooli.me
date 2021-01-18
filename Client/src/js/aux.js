
  export async function sha512(data) {
    const utf8 = new TextEncoder("utf-8");
    const string = utf8.encode(data);
    const hash = await crypto.subtle.digest("SHA-512",string);
    const hashArray = new Uint8Array(hash);
    const hashString = String.fromCharCode(...hashArray);
    const base64 = btoa(hashString);
    return base64;
  }

  export async function newIdentity () {
    return sha512(crypto.getRandomValues(new Uint32Array(10)));
  }
