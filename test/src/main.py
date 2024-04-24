from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

# 设置数据库连接参数
db_connection_params = {
    'dbname': 'your_db_name',
    'user': 'your_db_user',
    'password': 'your_db_password',
    'host': 'your_db_host',
}

# 创建数据库连接
def create_db_connection():
    return psycopg2.connect(**db_connection_params)

@app.route('/upload_text', methods=['POST'])
def upload_text():
    if request.method == 'POST':
        text = request.json.get('text')
        if text:
            try:
                # 连接数据库
                conn = create_db_connection()
                cur = conn.cursor()
                # 执行插入操作
                cur.execute("INSERT INTO messages (text_content) VALUES (%s)", (text,))
                # 提交事务
                conn.commit()
                # 关闭连接
                cur.close()
                conn.close()
                response = {'message': 'Text uploaded successfully'}
                return jsonify(response)
            except Exception as e:
                # 发生错误时的处理
                print(e)
                response = {'error': 'Failed to upload message to the database'}
                return jsonify(response), 500
        else:
            response = {'error': 'No text provided'}
            return jsonify(response), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
