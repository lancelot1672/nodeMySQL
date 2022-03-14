module.exports = {
    isOwner:function(request, response){
        if(request.user){
            return true;
        }else{
            return false;
        }
    },
    statusUI:function(request, response){
        var authStatusUI =  `<a href="/auth/login">Login</a> | <a href="/auth/enroll">Sign Up</a>`;
        if(this.isOwner(request, response)){
            authStatusUI = `${request.user.name} | <a href="/auth/logout">logout</a>`;
        }
        return authStatusUI;
    }
}