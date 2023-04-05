module.exports.interviewingMail = (email, payload)=> {
    const {
        courseInfo,
    } = payload;

    const {
        name
    } = courseInfo;

    const data = {
        from: 'vinhphucit02@gmail.com',
        to: email,
        subject: 'Bạn đã lọt vào vòng phỏng vấn',
        html: 
        (`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                
            </head>
            <body>
                <div class="container" style="width: 50%;height: 100%;margin: 0 auto;box-shadow: 3px 3px 3px black;">
                    <div class="header" style="width: 100%;display: flex;">
                        <img src="https://storage.googleapis.com/youth-media/post-thumbnails/af655623-cecd-4bf4-bfac-1d17e3a4bf07.jpg" alt="Ảnh học mãi" style="width: 100%;height: 250px;">
                    </div>
                    <div class="content">
                        <div class="title">
                            <h3 class="title-header" style="text-align: center;font-size: 26px;">Chúc mừng bạn đã lọt vào vòng phỏng vấn</h3>
                        </div>
                        <div class="description" style="margin: -10px 0 0 30px;">
                            <p>Bạn là một trong số những ứng viên lọt vào vòng phỏng vấn cho khóa học ${name}.</p>
                            <p>Chúng ta sẽ có một buổi phỏng vấn online với hệ thống học mãi</p>
                            <p>Link phỏng vấn:</p>
                            <ul>
                                <li>Thời gian: ${new Date(Date.now() + 12096e5)}</li>
                                <li>Giờ: 09h00</li>
                                <li>Link: Googlemeet.com/hethonghocmai</li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer" style="background-color: rgb(242, 164, 9);margin-top: 30px;height: 80px;">
                        <div class="copy-right" style="margin-left: 30px;margin-top: 10px;display: inline-block;">
                            <p style="color: white;font-size: 10px;">@${email}, when ${new Date}</p>
                            <p style="color: white;font-size: 10px;">Hệ thống giáo dục Học Mãi</p>
                        </div>
                        <div class="redirect-media" style="margin-right: 30px;margin-top: 10px;display: inline-block;">
                            <a href="hocmai.vn">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVSa4yPDLlZ_w3gn3nJyPhCfEfYTrzaHdT_2OWPv3OTWxOnvQdHvupYAtstUNbQYsTWp8&usqp=CAU" alt="" style="border-radius: 50%;width: 40px;height: 40px;margin-left: 320px;">
                            </a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `)
    };

    return {data};
}

module.exports.approveMail = (email, payload)=> {
    const {
        courseInfo,
    } = payload;

    const {
        name
    } = courseInfo;
    const data = {
        from: 'vinhphucit02@gmail.com',
        to: email,
        subject: 'Bạn đã trúng tuyển vào khóa học',
        html: 
        (`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                
            </head>
            <body>
                <div class="container" style="width: 50%;height: 100%;margin: 0 auto;box-shadow: 3px 3px 3px black;">
                    <div class="header" style="width: 100%;display: flex;">
                        <img src="https://storage.googleapis.com/youth-media/post-thumbnails/af655623-cecd-4bf4-bfac-1d17e3a4bf07.jpg" alt="Ảnh học mãi" style="width: 100%;height: 250px;">
                    </div>
                    <div class="content">
                        <div class="title">
                            <h3 class="title-header" style="text-align: center;font-size: 26px;">Bạn đã được trúng tuyển vào vị trí trợ lý</h3>
                        </div>
                        <div class="description" style="margin: -10px 0 0 30px;">
                            <p>Chúc mừng bạn đã trúng tuyển vào vị trí trợ lý cho khóa học ${name}</p>
                            <p>Do tính chất công việc, thời gian làm việc của bạn sẽ linh động chứ không cố định vào 1 buổi nào cả</p>
                            <p>Các phúc lợi khi làm việc ở học mãi:</p>
                            <ul>
                                <li>Lương trả theo số lượng bài chấm, mỗi bài chấm 10.000đ</li>
                                <li>Ngày nghỉ lễ, team building, ...</li>
                                <li>Thưởng tháng 13</li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer" style="background-color: rgb(242, 164, 9);margin-top: 30px;height: 80px;">
                        <div class="copy-right" style="margin-left: 30px;margin-top: 10px;display: inline-block;">
                            <p style="color: white;font-size: 10px;">@@${email}, when ${new Date}</p>
                            <p style="color: white;font-size: 10px;">Hệ thống giáo dục Học Mãi</p>
                        </div>
                        <div class="redirect-media" style="margin-right: 30px;margin-top: 10px;display: inline-block;">
                            <a href="hocmai.vn">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVSa4yPDLlZ_w3gn3nJyPhCfEfYTrzaHdT_2OWPv3OTWxOnvQdHvupYAtstUNbQYsTWp8&usqp=CAU" alt="" style="border-radius: 50%;width: 40px;height: 40px;margin-left: 320px;">
                            </a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `)
    };

    return {data};
}

module.exports.rejectMail = (email, payload)=> {
    const {
        courseInfo,
    } = payload;

    const {
        name
    } = courseInfo;
    const data = {
        from: 'vinhphucit02@gmail.com',
        to: email,
        subject: 'Bạn đã bị từ chối',
        html: 
        (`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                
            </head>
            <body>
                <div class="container" style="width: 50%;height: 100%;margin: 0 auto;box-shadow: 3px 3px 3px black;">
                    <div class="header" style="width: 100%;display: flex;">
                        <img src="https://storage.googleapis.com/youth-media/post-thumbnails/af655623-cecd-4bf4-bfac-1d17e3a4bf07.jpg" alt="Ảnh học mãi" style="width: 100%;height: 250px;">
                    </div>
                    <div class="content">
                        <div class="title">
                            <h3 class="title-header" style="text-align: center;font-size: 26px;">Bạn đã bị từ chối</h3>
                        </div>
                        <div class="description" style="margin: -10px 0 0 30px;">
                            <p>Do không đáp ứng được một số điều kiện của khóa học, đơn apply vào vị trí trợ lý cho khóa học ${name} đã bị từ chối.</p>
                            <p>Chúng tôi rất tiếc, mong là sẽ gặp lại bạn ở các đợt phỏng vấn sau</p>
                            <p>Cảm ơn bạn đã đến với buổi phỏng vấn này.</p>
                        </div>
                    </div>
                    <div class="footer" style="background-color: rgb(242, 164, 9);margin-top: 30px;height: 80px;">
                        <div class="copy-right" style="margin-left: 30px;margin-top: 10px;display: inline-block;">
                            <p style="color: white;font-size: 10px;">@Username, when 2022</p>
                            <p style="color: white;font-size: 10px;">@${email}, when ${new Date}</p>
                        </div>
                        <div class="redirect-media" style="margin-right: 30px;margin-top: 10px;display: inline-block;">
                            <a href="hocmai.vn">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVSa4yPDLlZ_w3gn3nJyPhCfEfYTrzaHdT_2OWPv3OTWxOnvQdHvupYAtstUNbQYsTWp8&usqp=CAU" alt="" style="border-radius: 50%;width: 40px;height: 40px;margin-left: 320px;">
                            </a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `)
    };

    return {data};
}