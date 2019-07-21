﻿DROP TABLE IF EXISTS borrowings;

CREATE TABLE borrowings (
    borrowerid varchar,
    borrowdate varchar,
    returndue varchar,
    books varchar
);

INSERT INTO borrowings (borrowerid,borrowdate,returndue,books) VALUES 
('sam','1558675725797','1559885325797','[{"id":"25","title":"How the Body Works","year":"2012","author":"Dr. Peter Abrahams","publisher":"Popular U.K. Pte. Ltd.","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51cpMlDnFIL._SX258_BO1,204,203,200_.jpg"},{"id":"93","title":"The Strange Case of Dr. Jekyll and Mr. Hyde","year":"N/A","author":"Robert Louis Stevenson, retold by Mitsu Yamamoto","publisher":"Baronet Books","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51PTrPC-F0L.jpg"},{"id":"111","title":"Dopesick: Dealers, Doctors, and the Drug Company that Addicted America","year":"2018","author":"Beth Macy","publisher":"Little, Brown, and Company","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51btuIO7E2L._AC_SR201,266_.jpg"}]')
,('alex21','1562574820493','1563784420493','[{"id":"115","title":"21 Lessons for the 21st Century ","year":"2018","author":"Yuval Noah Harari","publisher":"Spiegel and Grau","coverimg":"https://images-na.ssl-images-amazon.com/images/I/81o9vblSjmL._AC_SR201,266_.jpg"}]')
,('mrhyde','1563330664018','1564540264018','[{"id":"28","title":"Kidnapped","year":"N/A","author":"Robert Louis Stevenson","publisher":"Peter Haddock Publishing","coverimg":"https://images-na.ssl-images-amazon.com/images/I/5161HlPWaML._SX322_BO1,204,203,200_.jpg"},{"id":"62","title":"Treasure Island","year":"N/A","author":"Robert Louis Stevenson","publisher":"Peter Haddock Publishing","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51W7H0q4HPL._SX328_BO1,204,203,200_.jpg"},{"id":"58","title":"The Outcasts of Poker Flat, THe Luck of Roaring Camp and Other Stories","year":"N/A","author":"Bret Harte, with introduction by John Robert Colombo","publisher":"Airmont Publishing Co. Inc.","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51CM1uAaGuL._SX326_BO1,204,203,200_.jpg"},{"id":"93","title":"The Strange Case of Dr. Jekyll and Mr. Hyde","year":"N/A","author":"Robert Louis Stevenson, retold by Mitsu Yamamoto","publisher":"Baronet Books","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51PTrPC-F0L.jpg"}]')
,('boo','1558605004925','1559814604925','[{"id":"85","title":"Noddy and the Parasol","year":"2001","author":"Enid Blyton","publisher":"Egmont Imagination (India) Ltd.","coverimg":"https://images-na.ssl-images-amazon.com/images/I/41J9ZVWWY5L._BO1,204,203,200_.jpg"},{"id":"86","title":"Bella Baxter Inn Trouble","year":"2005","author":"Jane B. Mason and Sarah Hines Stephens","publisher":"Simon and Schuster Inc.","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51MlQfUcCYL._SX317_BO1,204,203,200_.jpg"},{"id":"13","title":"Fabel Aesop Untuk Kanak-Kanak: Angin Utara Dengan Matahari","year":"N/A","author":"Arowana Research and Development Unit","publisher":"Arowana Publications Sdn. Bhd.","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51t5bFhZz9L._SX382_BO1,204,203,200_.jpg"}]')
,('tom','1558343742815','1559553342817','[{"id":"119","title":"Bad Blood: Secrets and Lies in a Silicon Valley Startup","year":"2018","author":"John Carreyrou","publisher":"Knopf","coverimg":"https://images-na.ssl-images-amazon.com/images/I/71rtQvf5UVL._AC_SR201,266_.jpg"},{"id":"114","title":"Frederick Douglass: Prophet of Freedom ","year":"2018","author":"David W. Blight","publisher":"Simon and Schuster","coverimg":"https://images-na.ssl-images-amazon.com/images/I/810ygjggs-L._AC_SR201,266_.jpg"},{"id":"107","title":"Children of Blood and Bone (Legacy of Orisha)","year":"2018","author":"Tomi Adeyemi","publisher":"Henry Holt and Co.","coverimg":"https://images-na.ssl-images-amazon.com/images/I/A1agLFsWkOL._AC_SR201,266_.jpg"}]')
,('tyler','1558662987676','1559872587676','[{"id":"107","title":"Children of Blood and Bone (Legacy of Orisha)","year":"2018","author":"Tomi Adeyemi","publisher":"Henry Holt and Co.","coverimg":"https://images-na.ssl-images-amazon.com/images/I/A1agLFsWkOL._AC_SR201,266_.jpg"}]')
,('louis','1558675758966','1559885358966','[{"id":"93","title":"The Strange Case of Dr. Jekyll and Mr. Hyde","year":"N/A","author":"Robert Louis Stevenson, retold by Mitsu Yamamoto","publisher":"Baronet Books","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51PTrPC-F0L.jpg"}]')
,('kingkong','1548950400000','1550160000000','[{"id":"88","title":"Zarafa","year":"1999","author":"Michael Allin","publisher":"REVIEW publishing","coverimg":"https://images-na.ssl-images-amazon.com/images/I/515dhbTFyPL._SX324_BO1,204,203,200_.jpg"},{"id":"115","title":"21 Lessons for the 21st Century ","year":"2018","author":"Yuval Noah Harari","publisher":"Spiegel and Grau","coverimg":"https://images-na.ssl-images-amazon.com/images/I/81o9vblSjmL._AC_SR201,266_.jpg"},{"id":"100","title":"Educated: A Memoir","year":"2018","author":"Tara Westover","publisher":"Random House","coverimg":"https://images-na.ssl-images-amazon.com/images/I/81WojUxbbFL._AC_SR201,266_.jpg"}]')
,('keanu2077','1562575374516','1563784974516','[{"id":"25","title":"How the Body Works","year":"2012","author":"Dr. Peter Abrahams","publisher":"Popular U.K. Pte. Ltd.","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51cpMlDnFIL._SX258_BO1,204,203,200_.jpg"}]')
,('ara','1558343735178','1559553335178','[{"id":"7","title":"Archie''s Double Digest (#190)","year":"N/A","author":"N/A","publisher":"N/A","coverimg":"https://images-na.ssl-images-amazon.com/images/I/61n-RTHjTgL._SX368_BO1,204,203,200_.jpg"},{"id":"5","title":"Adventures of the Six Cousins","year":"2002","author":"Enid Blyton","publisher":"Award Publications Ltd.","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51zifsQYC7L._SX346_BO1,204,203,200_.jpg"},{"id":"6","title":"Aesop''s Fables for Little Children: The Kite and the Butterfly","year":"N/A","author":"Arowana Research and Development Unit","publisher":"Arowana Publications Sdn. Bhd.","coverimg":"https://images-na.ssl-images-amazon.com/images/I/51Z4yJW7uwL._SX258_BO1,204,203,200_.jpg"}]')
;
INSERT INTO borrowings (borrowerid,borrowdate,returndue,books) VALUES 
('tom','1555430400000','1556640000000','[{"id":"119","title":"Bad Blood: Secrets and Lies in a Silicon Valley Startup","year":"2018","author":"John Carreyrou","publisher":"Knopf","coverimg":"https://images-na.ssl-images-amazon.com/images/I/71rtQvf5UVL._AC_SR201,266_.jpg"},{"id":"114","title":"Frederick Douglass: Prophet of Freedom ","year":"2018","author":"David W. Blight","publisher":"Simon and Schuster","coverimg":"https://images-na.ssl-images-amazon.com/images/I/810ygjggs-L._AC_SR201,266_.jpg"},{"id":"107","title":"Children of Blood and Bone (Legacy of Orisha)","year":"2018","author":"Tomi Adeyemi","publisher":"Henry Holt and Co.","coverimg":"https://images-na.ssl-images-amazon.com/images/I/A1agLFsWkOL._AC_SR201,266_.jpg"}]')
;
