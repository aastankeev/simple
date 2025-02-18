import os
import subprocess
import time
import ctypes
import pygetwindow as gw
import threading
import tkinter as tk
from pynput.mouse import Listener

CLICK_ZONE_X = 10
CLICK_ZONE_Y = 10
CLICK_ZONE_SIZE = 50
STOP_ZONE_X = CLICK_ZONE_X + CLICK_ZONE_SIZE + 10
STOP_ZONE_Y = CLICK_ZONE_Y
STOP_ZONE_SIZE = CLICK_ZONE_SIZE

launched_windows = []  # Список запущенных окон Chrome

def close_chrome_windows():
    """Закрывает только те окна Chrome, которые были запущены скриптом."""
    global launched_windows
    for win in launched_windows:
        if win in gw.getAllWindows():  # Проверяем, что окно еще существует
            win.close()
    launched_windows.clear()  # Очищаем список

def launch_chrome_with_profile(profile_path, url):
    """Запуск Chrome с профилем."""
    chrome_executable = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    subprocess.Popen([
        chrome_executable,
        f'--user-data-dir={os.path.dirname(profile_path)}',
        f'--profile-directory={os.path.basename(profile_path)}',
        '--new-window',
        url
    ])

def align_windows():
    """Выравнивает окна Chrome."""
    global launched_windows
    user32 = ctypes.windll.user32
    screen_width = user32.GetSystemMetrics(0)
    screen_height = user32.GetSystemMetrics(1)

    windows = [win for win in gw.getAllWindows() if "Google Chrome" in win.title and win not in launched_windows]
    launched_windows = windows  # Запоминаем запущенные окна

    num_windows = len(windows)
    if num_windows == 0:
        return

    rows = int(num_windows**0.5)
    cols = (num_windows + rows - 1) // rows
    window_width = screen_width // cols
    window_height = screen_height // rows

    for index, win in enumerate(windows):
        col = index % cols
        row = index // cols
        x = col * window_width
        y = row * window_height
        win.resizeTo(window_width, window_height)
        win.moveTo(x, y)

def generate_url():
    """Генерация ссылки."""
    return 'тут необходимо указать ссылку'

chrome_user_data_path = os.path.expanduser(r'~\AppData\Local\Google\Chrome\User Data')

profiles = [
    os.path.join(chrome_user_data_path, folder)
    for folder in os.listdir(chrome_user_data_path)
    if os.path.isdir(os.path.join(chrome_user_data_path, folder)) and
    (folder.startswith('Profile') or folder == 'Default')
]

if not profiles:
    print("Не найдено профилей Chrome.")
    exit()

print(f"Найдено {len(profiles)} профилей.")

group_size = 3
current_index = 0
all_profiles_started = False

def run_profiles():
    """Запуск следующей группы профилей."""
    global current_index, all_profiles_started
    if all_profiles_started:
        print("\n✅ Все профили уже были запущены, запусков больше не будет.")
        return

    # Закрываем предыдущие окна перед запуском новых
    close_chrome_windows()
    time.sleep(2)

    if current_index >= len(profiles):
        print("\n✅ Все профили запущены!")
        all_profiles_started = True
        return

    group = profiles[current_index:current_index + group_size]
    urls = [generate_url() for _ in group]

    print(f"\n🚀 Запуск профилей: {current_index + 1} - {current_index + len(group)}")

    launched = 0
    for profile, url in zip(group, urls):
        launch_chrome_with_profile(profile, url)
        launched += 1
        time.sleep(1)

    print(f"✅ Запущено окон: {launched}")

    time.sleep(5)
    align_windows()

    current_index += launched
    if current_index >= len(profiles):
        all_profiles_started = True
        print("\n✅ Все профили запущены!")

def on_click(x, y, button, pressed):
    """Обработчик кликов."""
    if pressed:
        if CLICK_ZONE_X <= x <= CLICK_ZONE_X + CLICK_ZONE_SIZE and CLICK_ZONE_Y <= y <= CLICK_ZONE_Y + CLICK_ZONE_SIZE:
            run_profiles()
        elif STOP_ZONE_X <= x <= STOP_ZONE_X + STOP_ZONE_SIZE and STOP_ZONE_Y <= y <= STOP_ZONE_Y + STOP_ZONE_SIZE:
            print("\n❌ Завершение работы скрипта...")
            close_chrome_windows()
            os._exit(0)

def draw_click_zones():
    """Отображает кнопки."""
    root = tk.Tk()
    root.overrideredirect(True)
    root.attributes('-topmost', True)
    root.geometry(f"{CLICK_ZONE_SIZE + STOP_ZONE_SIZE + 20}x{CLICK_ZONE_SIZE}+{CLICK_ZONE_X}+{CLICK_ZONE_Y}")

    canvas = tk.Canvas(root, width=CLICK_ZONE_SIZE + STOP_ZONE_SIZE + 20, height=CLICK_ZONE_SIZE)
    canvas.pack()

    canvas.create_rectangle(0, 0, CLICK_ZONE_SIZE, CLICK_ZONE_SIZE, fill="red", outline="black")
    canvas.create_text(CLICK_ZONE_SIZE // 2, CLICK_ZONE_SIZE // 2, text="▶", font=("Arial", 16), fill="white")

    canvas.create_rectangle(CLICK_ZONE_SIZE + 10, 0, CLICK_ZONE_SIZE + STOP_ZONE_SIZE + 10, STOP_ZONE_SIZE, fill="blue", outline="black")
    canvas.create_text(CLICK_ZONE_SIZE + STOP_ZONE_SIZE // 2 + 10, STOP_ZONE_SIZE // 2, text="⏹", font=("Arial", 16), fill="white")

    root.mainloop()

mouse_listener = Listener(on_click=on_click)
mouse_listener.start()

tk_thread = threading.Thread(target=draw_click_zones, daemon=True)
tk_thread.start()

run_profiles()


