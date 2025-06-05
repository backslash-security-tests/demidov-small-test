import ctypes

# Allocate a buffer of 8 bytes on the heap
buffer = ctypes.create_string_buffer(8)

# Intentionally write more than 8 bytes to the buffer (overflow)
data = b"A" * 16
ctypes.memmove(buffer, data, len(data))  # Vulnerable: writes 16 bytes into an 8-byte buffer

print(buffer.raw)

import datetime
import re
import subprocess
from hashlib import md5

import jwt
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt

from .models import CSRF_user_tbl
from .views import authentication_decorator

# import os

## Mitre top1 | CWE:787

# target zone
FLAG = "NOT_SUPPOSED_TO_BE_ACCESSED"

# target zone end


@authentication_decorator
def mitre_top1(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top1.html')

@authentication_decorator
def mitre_top2(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top2.html')

@authentication_decorator
def mitre_top3(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top3.html')
        
@authentication_decorator
def mitre_top4(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top4.html')
        
@authentication_decorator
def mitre_top5(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top5.html')
        
@authentication_decorator
def mitre_top6(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top6.html')
        
@authentication_decorator
def mitre_top7(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top7.html')
        
@authentication_decorator
def mitre_top8(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top8.html')
        
@authentication_decorator
def mitre_top9(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top9.html')
        
@authentication_decorator
def mitre_top10(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top10.html')
        
@authentication_decorator
def mitre_top11(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top11.html')
        
@authentication_decorator
def mitre_top12(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top12.html')
        
@authentication_decorator
def mitre_top13(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top13.html')
        
@authentication_decorator
def mitre_top14(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top14.html')

@authentication_decorator
def mitre_top15(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top15.html')

@authentication_decorator
def mitre_top16(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top16.html')

@authentication_decorator
def mitre_top17(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top17.html')

@authentication_decorator
def mitre_top18(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top18.html')

@authentication_decorator
def mitre_top19(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top19.html')


@authentication_decorator
def mitre_top20(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top20.html')


@authentication_decorator
def mitre_top21(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top21.html')


@authentication_decorator
def mitre_top22(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top22.html')


@authentication_decorator
def mitre_top23(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top23.html')


@authentication_decorator
def mitre_top24(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top24.html')

@authentication_decorator
def mitre_top25(request):
    if request.method == 'GET':
        return render(request, 'mitre/mitre_top25.html')

@authentication_decorator
def csrf_lab_login(request):
    if request.method == 'GET':
        return render(request, 'mitre/csrf_lab_login.html')
    elif request.method == 'POST':
        password = request.POST.get('password')
        username = request.POST.get('username')
        password = md5(password.encode()).hexdigest()
        User = CSRF_user_tbl.objects.filter(username=username, password=password)
        if User:
            payload ={
                'username': username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=300),
                'iat': datetime.datetime.utcnow()
            }
            cookie = jwt.encode(payload, 'csrf_vulneribility', algorithm='HS256')
            response = redirect("/mitre/9/lab/transaction")
            response.set_cookie('auth_cookiee', cookie)
            return response
        else :
            return redirect('/mitre/9/lab/login')

@authentication_decorator
@csrf_exempt
def csrf_transfer_monei(request):
    if request.method == 'GET':
        try:
            cookie = request.COOKIES['auth_cookiee']
            payload = jwt.decode(cookie, 'csrf_vulneribility', algorithms=['HS256'])
            username = payload['username']
            User = CSRF_user_tbl.objects.filter(username=username)
            if not User:
                redirect('/mitre/9/lab/login')
            return render(request, 'mitre/csrf_dashboard.html', {'balance': User[0].balance})
        except:
            return redirect('/mitre/9/lab/login')

def csrf_transfer_monei_api(request,recipent,amount):
    if request.method == "GET":
        cookie = request.COOKIES['auth_cookiee']
        payload = jwt.decode(cookie, 'csrf_vulneribility', algorithms=['HS256'])
        username = payload['username']
        User = CSRF_user_tbl.objects.filter(username=username)
        if not User:
            return redirect('/mitre/9/lab/login')
        if int(amount) > 0:
            if int(amount) <= User[0].balance:
                recipent = CSRF_user_tbl.objects.filter(username=recipent)
                if recipent:
                    recipent = recipent[0]
                    recipent.balance = recipent.balance + int(amount)
                    recipent.save()
                    User[0].balance = User[0].balance - int(amount)
                    User[0].save()
        return redirect('/mitre/9/lab/transaction') 
    else:
        return redirect ('/mitre/9/lab/transaction')


# @authentication_decorator
@csrf_exempt
def mitre_lab_25_api(request):
    if request.method == "POST":
        expression = request.POST.get('expression')
        result = eval(expression)
        return JsonResponse({'result': result})
    else:
        return redirect('/mitre/25/lab/')


@authentication_decorator
def mitre_lab_25(request):
    return render(request, 'mitre/mitre_lab_25.html')

@authentication_decorator
def mitre_lab_17(request):
    return render(request, 'mitre/mitre_lab_17.html')

def command_out(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return process.communicate()
    
    wtfer
brokemre
shovahha
aa
sad
-----BEGIN PRIVATE KEY-----
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
hULNN0NLVhLEhJYBj9DzFmA=
-----END PRIVATE KEY-----

@csrf_exempt
def mitre_lab_17_api(request):
    if request.method == "POST":
        ip = request.POST.get('ip')
        command = "nmap " + ip 
        res, err = command_out(command)
        res = res.decode()
        err = err.decode()
        pattern = "STATE SERVICE.*\\n\\n"
        ports = re.findall(pattern, res,re.DOTALL)[0][14:-2].split('\n')
        return JsonResponse({'raw_res': str(res), 'raw_err': str(err), 'ports': ports})