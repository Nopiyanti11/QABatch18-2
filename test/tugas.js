const { describe } = require("mocha");
const assert = require("assert");
const { expect } = require("chai");

let token;

describe("API Automation Test Suite - Digital Skola Sesi 7", function () {
  
  // 1. POST Request: Login (Positive Case)
  it("Valid Login", async function () {
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/login",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: "admin",
          password: "admin",
        }),
      }
    );

    expect(response.status).to.equal(200);

    const data = await response.json();
    expect(data.message).to.eql("Login successful");

    // Simpan Token
    token = data.token;
  });

 // 2. GET Request: User Details
  it("Get User", async function () {
    expect(token).to.be.a("string");

    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/users",
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    expect(response.status).to.equal(200);

    // Ambil data JSON 
    const data = await response.json();
    expect(data).to.be.an("object");
    expect(data.users).to.be.an("array");

    // Indeks [3] digunakan untuk mengecek data pada urutan ke-4 (karena dihitung dari 0)
    expect(data.users[3].username).to.equal("nopiyanti");
  });
   // 3. POST Request: Add User (Positive Case)
   it("Add User - Positive Case", async function () {
    const username = "Nopiyantiii"; // Deklarasikan variabel username di sini

    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/add-user", // Endpoint yang benar sesuai dokumentasi
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          username: username, // Menggunakan variabel username
          age: 50
        }),
      }
    );
     //assert status code
    expect(response.status).to.be.oneOf([200, 201]);
     //assert respon body json
    const data = await response.json();
   // console.log("Ini respon message :", data);
    //assert message
    expect(data).to.be.an("object");
    expect(data.message).to.equal(`User successfully added, Hi ${username}!`);
  });

//   4. POST Request: Add User (Negative Case)
  it("Add User - Negative Case", async function () {
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/add-user",
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          username: "Nopiyanti",
          age : "dua puluh"  // tidak boleh diisi text
        }),
      }
    );

    expect(response.status).to.be.least(400);
   //console.log("Status Code Saat Ini:", response.status);
  
   // Assert 2: Memeriksa response body (memastikan berbentuk object dan memuat pesan error)
   const data = await response.json();
  // console.log("Ini Response Body:", data);
    expect(data).to.be.an("object");
  });
});