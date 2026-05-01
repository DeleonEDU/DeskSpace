#!/usr/bin/env python3
import argparse
import subprocess
import sys
import os
import re

# Define the services and their test commands
SERVICES = {
    "auth": {
        "dir": "auth_service",
        "command": ["python", "manage.py", "test", "users"]
    },
    "space": {
        "dir": "space_service",
        "command": ["python", "manage.py", "test", "spaces"]
    },
    "booking": {
        "dir": "booking_service",
        "command": ["python", "manage.py", "test", "bookings"]
    }
}

E2E_COMMAND = ["pytest", "e2e_tests/test_e2e.py", "-v"]

def print_header(title):
    print("\n" + "=" * 50)
    print(f"🚀 RUNNING: {title}")
    print("=" * 50 + "\n")

def run_command(command, cwd=None):
    """Run a shell command, stream output to console, and return (success, output)."""
    try:
        # We use Popen to stream output in real-time while also capturing it
        process = subprocess.Popen(
            command, 
            cwd=cwd, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        output = []
        for line in iter(process.stdout.readline, ''):
            print(line, end="")
            output.append(line)
            
        process.stdout.close()
        process.wait()
        return process.returncode == 0, "".join(output)
        
    except FileNotFoundError:
        print(f"❌ Error: Command not found: {' '.join(command)}")
        print("Make sure your virtual environment is activated (source venv/bin/activate).")
        return False, ""

def extract_test_count(output, is_pytest=False):
    """Extract the number of tests run from the output."""
    if not output:
        return 0
        
    if is_pytest:
        # Pytest output: "collected X items" or "X passed"
        match = re.search(r'collected (\d+) item', output)
        if match:
            return int(match.group(1))
        match = re.search(r'(\d+) passed', output)
        if match:
            return int(match.group(1))
    else:
        # Django output: "Ran X tests in"
        match = re.search(r'Ran (\d+) test', output)
        if match:
            return int(match.group(1))
            
    return 0

def main():
    parser = argparse.ArgumentParser(description="DeskSpace Test Runner")
    
    # Define flags
    parser.add_argument("--all", action="store_true", help="Run all tests (Unit, Integration, and E2E)")
    parser.add_argument("--unit", action="store_true", help="Run only Unit and Integration tests for all Django services")
    parser.add_argument("--e2e", action="store_true", help="Run only End-to-End (E2E) tests")
    
    # Service specific flags
    parser.add_argument("--auth", action="store_true", help="Run tests for Auth Service only")
    parser.add_argument("--space", action="store_true", help="Run tests for Space Service only")
    parser.add_argument("--booking", action="store_true", help="Run tests for Booking Service only")

    args = parser.parse_args()

    # If no arguments provided, default to --all
    if not any(vars(args).values()):
        print("No flags provided. Defaulting to running ALL tests (--all).")
        args.all = True

    all_success = True
    base_dir = os.path.abspath(os.path.dirname(__file__))

    # Determine which services to run
    services_to_run = []
    
    if args.all or args.unit:
        services_to_run = ["auth", "space", "booking"]
    else:
        if args.auth: services_to_run.append("auth")
        if args.space: services_to_run.append("space")
        if args.booking: services_to_run.append("booking")

    results = []
    total_tests = 0

    # Run Django Service Tests (Unit & Integration)
    for service_name in services_to_run:
        service_info = SERVICES[service_name]
        print_header(f"{service_name.capitalize()} Service Tests")
        
        service_dir = os.path.join(base_dir, service_info["dir"])
        success, output = run_command(service_info["command"], cwd=service_dir)
        
        count = extract_test_count(output, is_pytest=False)
        total_tests += count
        
        results.append({
            "name": f"{service_name.capitalize()} Service",
            "success": success,
            "count": count
        })
        
        if not success:
            all_success = False

    # Run E2E Tests
    if args.all or args.e2e:
        print_header("End-to-End (E2E) Tests")
        print("Note: E2E tests require Docker containers to be running (docker-compose up -d)\n")
        
        success, output = run_command(E2E_COMMAND, cwd=base_dir)
        
        count = extract_test_count(output, is_pytest=True)
        total_tests += count
        
        results.append({
            "name": "End-to-End (E2E)",
            "success": success,
            "count": count
        })
        
        if not success:
            all_success = False

    # Final Summary
    print("\n" + "=" * 55)
    print("TEST EXECUTION SUMMARY")
    print("=" * 55)
    
    for res in results:
        status_icon = "✅ PASSED" if res["success"] else "❌ FAILED"
        print(f"{status_icon.ljust(10)} | {str(res['count']).rjust(3)} tests | {res['name']}")
        
    print("-" * 55)
    
    if all_success:
        print(f"🎉 SUCCESS: All {total_tests} tests passed successfully!")
        print("=" * 55 + "\n")
        sys.exit(0)
    else:
        print(f"💥 FAILURE: Some tests failed. Total tests run: {total_tests}")
        print("=" * 55 + "\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
