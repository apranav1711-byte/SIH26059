"""Hosted request checks without a browser or network server."""
import io
import json
import os
import unittest
from unittest.mock import patch
from app import Handler
from real_data import observations

class Request(Handler):
    def __init__(self,path,origin=None,payload=None):
        self.path=path
        body=json.dumps(payload or {}).encode()
        self.headers={'Host':'polarroute.example','Content-Length':str(len(body))}
        if origin:self.headers['Origin']=origin
        self.rfile=io.BytesIO(body)
    def send(self,code,body,mime='application/json'):
        self.response=(code,body,mime)

class HostedTests(unittest.TestCase):
    @patch.dict(os.environ,{'VERCEL':'1'})
    def test_same_origin_calculation(self):
        req=Request('/api/run','https://polarroute.example',{'scenario':observations(),'options':{'forecast_method':'persistence'}})
        req.do_POST()
        self.assertEqual(req.response[0],200)
        self.assertIn('routes',req.response[1])
    @patch.dict(os.environ,{'VERCEL':'1'})
    def test_other_origin_rejected(self):
        req=Request('/api/run','https://elsewhere.example');req.do_POST()
        self.assertEqual(req.response[0],403)
    def test_bundled_observations(self):
        req=Request('/api/observations');req.do_GET()
        self.assertEqual(req.response[0],200)
        self.assertEqual(req.response[1]['data_kind'],'observational')

if __name__=='__main__':unittest.main()
