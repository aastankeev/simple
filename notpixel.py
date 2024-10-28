import os 
import subprocess
import time
import pyautogui
import pygetwindow as gw
import random
from datetime import datetime, timedelta


def get_chrome_profiles(chrome_path):
    profiles = []

    # Проверяем наличие папки Chrome
    if os.path.exists(chrome_path):
        # Проходим по всем подпапкам в указанной директории
        for folder in os.listdir(chrome_path):
            folder_path = os.path.join(chrome_path, folder)
            if os.path.isdir(folder_path) and folder.startswith('Profile'):
                profiles.append(folder_path)

    return profiles


def save_profiles_to_file(profiles, output_file):
    with open(output_file, 'w') as file:
        for profile in profiles:
            file.write(f"{profile}\n")


def read_profiles_from_file(file_path):
    # Читаем все профили из файла
    with open(file_path, 'r') as file:
        lines = file.readlines()
        profiles = [line.strip() for line in lines if line.strip()]  # Убираем пустые строки
    return profiles


def launch_chrome_with_profile(profile_path, url):
    # Указываем правильный путь к Google Chrome
    chrome_executable = r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'

    # Проверяем наличие файла Chrome
    if os.path.exists(chrome_executable):
        # Запускаем Chrome с указанным профилем
        subprocess.Popen([chrome_executable, f'--user-data-dir={os.path.dirname(profile_path)}',
                          f'--profile-directory={os.path.basename(profile_path)}', url])
    else:
        print("Не удалось найти Google Chrome. Проверьте путь к исполняемому файлу.")


def close_chrome_after_delay():
    delay = random.randint(301, 322)  # Случайное число интервал в секундах
    current_time = datetime.now()  # Текущее время
    close_time = current_time + timedelta(seconds=delay)  # Время закрытия

    print(f"Закрытие через {delay} секунд в {close_time.strftime('%H:%M:%S')}.")
#    print(f"Закрытие произойдёт в {close_time.strftime('%H:%M:%S')}.")

    time.sleep(delay)  # Ожидание перед закрытием
    # Закрытие всех процессов Chrome
    os.system("taskkill /F /IM chrome.exe")  # Для Windows


# Укажите путь к папке, где хранятся данные профилей Google Chrome
chrome_user_data_path = os.path.expanduser(r'~\AppData\Local\Google\Chrome\User Data')

# Файл для записи списка профилей
output_file_path = 'chrome_profiles.txt'

# Собираем и сохраняем профили
profiles = get_chrome_profiles(chrome_user_data_path)
save_profiles_to_file(profiles, output_file_path)

print(f"Найдено {len(profiles)} профилей. Список записан в файл {output_file_path}.")

# Список ссылок
links = [
f'https://web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3Dnotpixel%26appname%3Dapp%26startapp%3Dx{random.randint(453, 529)}_y{random.randint(367, 410)}'
]

while True:  # Бесконечный цикл
    profiles = read_profiles_from_file(output_file_path)  # Читаем профили в каждой итерации

    # Запуск Chrome с каждым профилем
    for profile in profiles:
        # Выбираем случайную ссылку
        random_link = random.choice(links)

        launch_chrome_with_profile(profile, random_link)

        # Закрытие профиля через случайное время
        close_chrome_after_delay()
