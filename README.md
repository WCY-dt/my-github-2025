<div align="center">
  <img src="static/img/band.svg" alt="band" />

  Statistics of your activities on GitHub in 2025.

  [简体中文](README_zh-CN.md) | English

  [![Server Status](https://img.shields.io/badge/dynamic/json?logo=linux&color=brightgreen&label=Server%20status&query=%24.status&cacheSeconds=600&url=https%3A%2F%2F202x.ch3nyang.top%2Fstatus)](https://202x.ch3nyang.top)

  [![GitHub issues](https://img.shields.io/github/issues/WCY-dt/my-github-2025)](https://github.com/WCY-dt/my-github-2025/issues) [![GitHub pull requests](https://img.shields.io/github/issues-pr/WCY-dt/my-github-2025)](https://github.com/WCY-dt/my-github-2025/pulls) [![GitHub license](https://img.shields.io/github/license/WCY-dt/my-github-2025)](https://github.com/WCY-dt/my-github-2025/blob/main/LICENSE)

  <strong style="font-size: 24px;">👉 Try it now: <a href="https://202x.ch3nyang.top">https://202x.ch3nyang.top</a></strong>
</div>

## Example

![example](example.png)

## Usage

> [!TIP]
>
> **New feature**: Now you can select any year from 2008 to 2025 to generate a report.

1. Visit [https://202x.ch3nyang.top](https://202x.ch3nyang.top).

2. Click the `Sign in with GitHub` button and authorize login.

3. Select your time zone and the year you want to generate, then click the `Generate` button, wait a few seconds, and you can view your activities on GitHub in 2025.

## Run locally

> [!IMPORTANT]
>
> Due to the features of the `datetime` library, this project requires Python-3.12 or above.

1. Clone the repository:

    ```bash
    git clone https://github.com/WCY-dt/my-github-2025.git
    cd my-github-2025
    ```

2. Create a Github OAuth App:

    Visit [GitHub Developer Settings](https://github.com/settings/developers) to create a new OAuth App. In it, fill in `Homepage URL` and `Authorization callback URL` with `http://127.0.0.1:5000` and `http://127.0.0.1:5000/callback` respectively.

    Get `Client ID` and `Client Secret`.

3. Configure the environment variable `.env` file in the root directory of the project. The content is as follows:

    ```env
    CLIENT_ID=your_client_id
    CLIENT_SECRET=your_client_secret
    ```

4. Install dependencies:

    ```bash
    make install
    ```

5. Run the project:

    ```bash
    make run
    ```

6. Visit `http://127.0.0.1:5000` and complete!
