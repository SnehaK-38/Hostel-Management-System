import time
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# =====================================================
# SLOW TYPING FUNCTION
# =====================================================
def slow_type(element, text, delay=0.4):
    for char in text:
        element.send_keys(char)
        time.sleep(delay)

# =====================================================
# EDGE OPTIONS (DISABLE PASSWORD POPUPS)
# =====================================================
options = Options()

options.add_argument("--disable-notifications")
options.add_argument("--disable-infobars")

# 🚨 THIS IS THE KEY FIX
prefs = {
    "credentials_enable_service": False,
    "profile.password_manager_enabled": False
}
options.add_experimental_option("prefs", prefs)

driver = webdriver.Edge(options=options)
driver.maximize_window()
wait = WebDriverWait(driver, 30)

# =====================================================
# OPEN SITE
# =====================================================
driver.get("http://localhost:3000")
time.sleep(2)

# =====================================================
# LOGIN
# =====================================================
wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//button[text()='Login']")
)).click()

wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//button[text()='Student']")
)).click()

slow_type(wait.until(
    EC.presence_of_element_located((By.NAME, "username"))
), "soumya")

slow_type(wait.until(
    EC.presence_of_element_located((By.NAME, "password"))
), "soumya")

wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//button[@type='submit']")
)).click()

# Allow dashboard to load
time.sleep(4)

# =====================================================
# OPEN COMPLAINT PAGE
# =====================================================
complain_btn = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//a[normalize-space()='Complain']")
))
driver.execute_script("arguments[0].scrollIntoView(true);", complain_btn)
driver.execute_script("arguments[0].click();", complain_btn)

# =====================================================
# FILL COMPLAINT FORM (SLOW)
# =====================================================
slow_type(wait.until(
    EC.presence_of_element_located((By.ID, "compfname"))
), "Soumya")

slow_type(driver.find_element(By.ID, "complname"), "Student")
slow_type(driver.find_element(By.ID, "compemail"), "soumya@student.com")
slow_type(driver.find_element(By.ID, "compsubject"), "Water Issue")

slow_type(
    driver.find_element(
        By.XPATH, "//textarea"
    ),
    "There is no water supply in the hostel since morning.",
    delay=0.2
)

time.sleep(1)

# =====================================================
# SUBMIT COMPLAINT
# =====================================================
submit_btn = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//button[@type='submit']")
))
driver.execute_script("arguments[0].scrollIntoView(true);", submit_btn)
driver.execute_script("arguments[0].click();", submit_btn)

time.sleep(3)

# =====================================================
# NAV BAR LOGOUT (NOT SIDEBAR)
# =====================================================
logout_btn = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//button[contains(text(),'Logout')] | //a[contains(text(),'Logout')]")
))
driver.execute_script("arguments[0].scrollIntoView(true);", logout_btn)
driver.execute_script("arguments[0].click();", logout_btn)

time.sleep(2)

input("✅ Complaint submitted and logged out successfully. Press Enter to exit...")
driver.quit()
