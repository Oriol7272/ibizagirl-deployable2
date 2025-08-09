#!/usr/bin/env python3
"""
Backend API Testing for IbizaGirl.pics Ocean Paradise
Tests the FastAPI backend endpoints
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class IbizaBackendTester:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()
        
    def log(self, message: str, level: str = "INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Dict[Any, Any] = None, headers: Dict[str, str] = None) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        
        if headers is None:
            headers = {'Content-Type': 'application/json'}
            
        self.tests_run += 1
        self.log(f"Testing {name}...")
        self.log(f"   URL: {url}")
        self.log(f"   Method: {method}")
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers, timeout=10)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, headers=headers, timeout=10)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data, headers=headers, timeout=10)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
                
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    self.log(f"   Response: {json.dumps(response_data, indent=2)}")
                except:
                    self.log(f"   Response: {response.text[:200]}...")
            else:
                self.log(f"FAILED - Expected {expected_status}, got {response.status_code}")
                self.log(f"   Response: {response.text[:500]}...")
                
            return success, response
            
        except requests.exceptions.ConnectionError as e:
            self.log(f"FAILED - Connection Error: {str(e)}", "ERROR")
            return False, None
        except requests.exceptions.Timeout as e:
            self.log(f"FAILED - Timeout: {str(e)}", "ERROR")
            return False, None
        except Exception as e:
            self.log(f"FAILED - Error: {str(e)}", "ERROR")
            return False, None
    
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET", 
            "/api/",
            200
        )
    
    def test_create_status_check(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        
        return self.run_test(
            "Create Status Check",
            "POST",
            "/api/status",
            200,
            data=test_data
        )
    
    def test_get_status_checks(self):
        """Test retrieving status checks"""
        return self.run_test(
            "Get Status Checks",
            "GET",
            "/api/status",
            200
        )
    
    def test_cors_headers(self):
        """Test CORS headers are present"""
        self.log("Testing CORS Headers...")
        try:
            response = self.session.options(f"{self.base_url}/api/", timeout=10)
            
            cors_headers = [
                'Access-Control-Allow-Origin',
                'Access-Control-Allow-Methods',
                'Access-Control-Allow-Headers'
            ]
            
            missing_headers = []
            for header in cors_headers:
                if header not in response.headers:
                    missing_headers.append(header)
            
            if not missing_headers:
                self.log("CORS headers present")
                self.tests_passed += 1
            else:
                self.log(f"Missing CORS headers: {missing_headers}")
                
            self.tests_run += 1
            return len(missing_headers) == 0, response
            
        except Exception as e:
            self.log(f"CORS test failed: {str(e)}", "ERROR")
            self.tests_run += 1
            return False, None
    
    def test_invalid_endpoint(self):
        """Test invalid endpoint returns 404"""
        return self.run_test(
            "Invalid Endpoint (404 Test)",
            "GET",
            "/api/nonexistent",
            404
        )
    
    def test_health_check(self):
        """Test if the backend is responding"""
        self.log("Testing Backend Health...")
        try:
            response = self.session.get(f"{self.base_url}/api/", timeout=5)
            if response.status_code == 200:
                self.log("Backend is healthy and responding")
                return True
            else:
                self.log(f"Backend responding but with status {response.status_code}")
                return False
        except Exception as e:
            self.log(f"Backend health check failed: {str(e)}", "ERROR")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        self.log("Starting IbizaGirl.pics Backend API Tests...")
        self.log(f"   Base URL: {self.base_url}")
        
        # Health check first
        if not self.test_health_check():
            self.log("Backend is not responding. Stopping tests.", "ERROR")
            return False
        
        # Run all API tests
        test_methods = [
            self.test_root_endpoint,
            self.test_create_status_check,
            self.test_get_status_checks,
            self.test_cors_headers,
            self.test_invalid_endpoint
        ]
        
        for test_method in test_methods:
            try:
                test_method()
            except Exception as e:
                self.log(f"Test {test_method.__name__} crashed: {str(e)}", "ERROR")
                self.tests_run += 1
        
        # Print summary
        self.log("\n" + "="*60)
        self.log("IBIZAGIRL.PICS BACKEND TEST SUMMARY")
        self.log("="*60)
        self.log(f"Tests Run: {self.tests_run}")
        self.log(f"Tests Passed: {self.tests_passed}")
        self.log(f"Tests Failed: {self.tests_run - self.tests_passed}")
        self.log(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.tests_passed == self.tests_run:
            self.log("ALL TESTS PASSED! Backend is working correctly.")
            return True
        else:
            self.log("Some tests failed. Check the logs above for details.")
            return False

def main():
    """Main test execution"""
    # Get backend URL from environment or use default
    backend_url = "https://e50fd2f1-0cb9-48c3-9ac3-eb340fa8736a.preview.emergentagent.com"
    
    # Try to get the public URL from frontend .env
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    backend_url = line.split('=', 1)[1].strip()
                    break
    except:
        pass
    
    print(f"IbizaGirl.pics Ocean Paradise - Backend API Tester")
    print(f"Testing backend at: {backend_url}")
    print("="*60)
    
    tester = IbizaBackendTester(backend_url)
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())