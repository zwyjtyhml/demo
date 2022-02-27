//javascript进行数据库连接

var con = new ActiveXObject("ADODB.Connection");
con.ConnectionString = "DRIVER={MySQL ODBC 5.1 Driver};OPTION=3;SERVER=127.0.0.1;User ID=root;Password=123456;Database=mysql;Port=3306";
con.open;
var rs = new ActiveXObject("ADODB.Recordset");
rs.open("select * from user", con);
while (!rs.eof) {
var u = rs.Fields("User");
document.write(u);
rs.moveNext;
}
rs.close();
rs = null;
con.close();
con = null;