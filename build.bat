call mvn clean compile
if %errorlevel% ==1 (
	echo ***Error:编译失败***
	goto end
)
call mvn help:effective-pom  1>effective-pom.txt
echo ******************************************
echo mvn scm:checkin
echo ******************************************
call mvn scm:checkin -Dmessage=patch%date:~0,4%%date:~5,2%%date:~8,2%(FUI)
if %errorlevel% ==1 (
	echo ***SVN提交失败***
	goto end
)
echo ******************************************
echo mvn release:prepare -Dresume=false
echo ******************************************
call mrp
if %errorlevel% ==1 (
	echo ***创建Subversion Tag失败,开始回退***
	call mrb
	goto end
)
echo ******************************************
echo mvn release:perform
echo ******************************************
call mr
:end
