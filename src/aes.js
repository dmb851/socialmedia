var aes256 = require("aes256");
var secret_key = "uI2ooxtwHeI6q69PS98fx9SWVGbpQohO";

export const to_Encrypt = (text) =>{
   var encrypted = aes256.encrypt(secret_key, text);
   return encrypted;
};

export const to_Decrypt = (cipher, username)=>{
   
   if(String(cipher).startsWith("Welcome")){
      return cipher;
   }

   if(String(cipher).startsWith(username)){
      return cipher;
   }
   
   if(cipher){
      var decrypted = aes256.decrypt(secret_key, String(cipher));
      return decrypted;

   }
};