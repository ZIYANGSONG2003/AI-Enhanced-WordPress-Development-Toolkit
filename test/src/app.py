from flask import Flask, request, jsonify  # 导入Flask框架中的Flask、request和jsonify模块
from flask_cors import CORS  # 导入Flask框架中的CORS扩展

app = Flask(__name__)  # 创建Flask应用实例
CORS(app)  # 使用CORS扩展解决跨域请求问题

@app.route('/upload_text', methods=['POST', 'GET', 'OPTIONS'])  # 定义路由'/upload_text'，支持POST、GET和OPTIONS请求
def upload_text():
    if request.method == 'POST':  # 处理POST请求
        text = request.json.get('text')  # 从请求中获取文本数据
        if text:  # 如果成功获取到文本数据
            print("Successfully received message:", text)  # 打印接收到的消息
            response = {'message': 'Text uploaded successfully'}  # 构造成功响应
            return jsonify(response)  # 返回JSON格式的成功响应
        else:  # 如果未能成功获取文本数据
            response = {'error': 'Failed to receive message'}  # 构造错误响应
            return jsonify(response), 400  # 返回JSON格式的错误响应，同时指定HTTP状态码为400
    elif request.method == 'GET':  # 处理GET请求
        return 'GET method is not supported for this route.', 405  # 返回不支持该方法的错误消息，并指定HTTP状态码为405
    elif request.method == 'OPTIONS':  # 处理OPTIONS请求
        # 构造允许跨域请求的响应头信息
        headers = {
            'Access-Control-Allow-Origin': '*',  # 允许来自任何源的跨域请求
            'Access-Control-Allow-Methods': 'POST, GET',  # 允许的HTTP方法为POST和GET
            'Access-Control-Allow-Headers': 'Content-Type'  # 允许的请求头为Content-Type
        }
        return ('', 204, headers)  # 返回空响应，并指定HTTP状态码为204，同时添加响应头信息

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)  # 在主程序中启动Flask应用，监听在0.0.0.0:8080上
