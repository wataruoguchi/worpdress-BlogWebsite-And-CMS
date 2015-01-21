<!DOCTYPE html>
<html>
    <head>
        <title>CMS:VANARTS STUDENT MOCK PROJECT SITE</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="./lib/vendor/foundation.min.css" />
		<link rel="stylesheet" href="./css/style.css" />
	
    </head>
    <body>
        <div class="row">
            <div class="small-12 small-centered medium-8 medium-centered column login-panel">
                <h2>Worpdress</h2>
                <form action="login-handler.php" method="post">
                    <div class="login panel clearfix">
                        <ul>
                            <li><h5>Log In</h5></li>
                            <li><label>Email address</label>
                                <input type="text" name="email"></li>
                            <li><label>Password</label>
                                <input type="password" name="upass"></li>
                            <li><input class="button radius right" type="submit" value="Log In"></li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
    </body>
</html>
