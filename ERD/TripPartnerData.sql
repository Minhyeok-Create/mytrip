#  user admin 데이터
insert into user (user_email, user_password, user_username, user_name, user_phonenumber, user_birthday, user_profile, user_provider, user_introdution, user_authorization)
values ('fullstackK08@naver.com',
        '1234',
        'admin1234',
        '이경원',
        '010-8297-0195',
        '2000-04-24',
        '',
        '',
        '',
        'admin'
        ),
        (
         'wonwon123123@naver.com',
         '1234',
         'user1234',
         '이경원',
        '010-1234-1234',
         '2000-02-11',
         '',
         '',
         '',
         'user'
        );

# business 데이터
insert into user (user_email, user_password,user_username,user_name,user_phonenumber,user_authorization,business_companynumber)
 values       (
        'business@naver.com',
         '1234',
         'business1234',
         '이경원',
         '010-1111-1111',
         'business',
         '123-11-12345'
        ) ;

# city data
insert into city (city_name, city_continent, city_language, city_currency, city_img, city_nation, q1_id,q2_id,q3_id,q4_id,q5_id)
values(
       '괌',
       '남태평양',
       '영어',
       '달러',
       'http://blogfiles.naver.net/MjAxODAzMTlfNTYg/MDAxNTIxNDI0ODM1NTc3.kAs0aOQ6f-WseyP43b36hfyHSJsGGiPTFaTY9ystN18g.-vaQH-bJSY78C3t-KzO9fFPL5O-jws5ieCzVo19hEdYg.JPEG.bella_hair/DSC_2040_1490.jpg',
       '미국',
       'A',
       'A',
       'A',
       'A',
       'A'),
        (
         '마닐라',
         '동남아시아',
         '타갈로그어',
         '페소',
         'https://upload.wikimedia.org/wikipedia/commons/e/e8/Makati_skyline_j_0_n.jpg',
         '필리핀',
         'A',
         'A',
         'A',
         'A',
         'B'
        ),
        (
         '나트랑',
         '동남아시아',
         '베트남어',
         '베트남 동',
         'http://blogfiles.naver.net/MjAyMzExMjBfMjY4/MDAxNzAwNDU3NDMxNDc0.CKocGU0LI5FTWoJO0RtoAl4KLn7KTnf_NWzk6qgaHH4g.f5bZXsZdumR-COPGEJdl4QSsTO13fUux03aaaXBuU1cg.JPEG.kallilogue/20231020_170103.jpg',
         '베트남',
         'A',
         'A',
         'A',
         'B',
         'A'
        ),
        (
         '세부',
         '동남아시아',
         '타갈로그어',
         '페소',
         'http://blogfiles.naver.net/MjAxOTA1MThfODcg/MDAxNTU4MTg5MjYxMzgw.mNujI39kyGpyaUCAX4fm5uXn8r6-mYWvhzuxzSfzdWIg.SQvuyHxpCGZfoB6f85zVGI8eD97YsUm11oCBLeTrtbYg.JPEG.cuti0118/20171208_095200.jpg',
         '필리핀',
         'A',
         'A',
         'A',
         'B',
         'B'
        ),
        (
         '방콕',
         '동남아시아',
         '태국어',
         '바트',
         'http://image.nmv.naver.net/blog_2023_02_18_1456/331afb4b-af1a-11ed-a5a6-d4f5ef58ac88_01.jpg',
         '태국',
         'A',
         'A',
         'B',
         'A',
         'A'
        ),
        (
         '프랑스',
         '유럽',
         '프랑스어',
         '유로',
         'http://blogfiles.naver.net/20160902_140/klaus_kim_1472823422803dmSP9_JPEG/IMG_2836.JPG',
         '프랑스',
         'A',
         'A',
         'B',
         'A',
         'A'
        )