# Docker 面試問題與答案完整整理 (100+題)

## 基礎概念

### 1. 什麼是 Docker？

Docker 是一個開源平台，旨在簡化應用程式的建構、傳輸和執行過程。其核心使用容器將軟體及其依賴項打包成單一的可攜式單元。容器是輕量級的，在隔離環境中執行，確保應用程式在不同環境中的行為一致，無論是在開發人員的筆記型電腦、測試伺服器還是生產機器上。

Docker 透過其容器化技術消除了「在我的機器上可以運行」的問題，允許應用程式在隔離環境中執行，同時共享主機作業系統的核心。這與傳統虛擬機不同，每個 VM 都執行自己完整的作業系統，使它們更重且更慢。

Docker 還提供了如 Docker Compose（用於管理多容器應用程式）、Docker Swarm（用於容器編排）和 Docker Hub（用於儲存和共享容器映像）等工具。Docker 容器高效且可擴展，非常適合雲原生應用程式和微服務架構。

Docker 的核心優勢是可攜性。一旦創建了 Docker 映像，它就可以在任何支援 Docker 的系統上執行，確保跨環境的一致性。由於能夠簡化應用程式部署和擴展，Docker 在 DevOps、持續整合/持續部署 (CI/CD) 流程和雲端運算中被廣泛使用。

### 2. Docker 中的容器是什麼？

Docker 中的容器是輕量級、可攜式的軟體單元，將應用程式及其依賴項打包在一起。Docker 容器執行 Docker 映像的實例，本質上是應用程式及其環境的快照。容器基於虛擬化概念，但與傳統虛擬機 (VM) 不同，容器共享主機機器的作業系統 (OS) 核心，同時彼此保持隔離。

Docker 容器的主要特性：
- **輕量級**：容器共享主機的 OS 核心，因此比需要完整 OS 的 VM 更輕量
- **可攜式**：容器可以在任何安裝了 Docker 的系統上執行
- **隔離**：每個容器在自己的隔離環境中執行
- **快速啟動**：容器可以在幾秒鐘內啟動

容器可以在任何安裝了 Docker 的機器上執行，特別適合雲原生應用程式、微服務架構和 CI/CD 工作流程。

### 3. Docker 和虛擬機 (VM) 的區別是什麼？

Docker 和虛擬機都提供了隔離應用程式的方法，但它們的方式根本不同。虛擬機是物理硬體的抽象，每個 VM 透過 hypervisor 在主機 OS 之上執行完整的作業系統。這意味著每個 VM 都包含自己完整的 OS，以及應用程式及其依賴項。相比之下，Docker 容器虛擬化 OS 本身而不是硬體，直接在主機的 OS 核心上執行應用程式。

主要區別：
- **資源使用**：容器更輕量，與主機共享 OS 核心；VM 需要為每個實例執行完整的 OS
- **啟動時間**：容器可以在幾秒鐘內啟動；VM 需要幾分鐘來啟動完整的 OS
- **可攜性**：容器高度可攜；VM 較不可攜，受 hypervisor 和底層硬體限制
- **隔離**：容器提供 OS 級隔離；VM 提供更強的硬體級隔離
- **效能**：容器開銷較小，效能更好；VM 由於完整 OS 開銷較大

總結：Docker 容器適用於需要快速啟動、可攜性和效率的場景，如微服務、雲原生應用程式和 CI/CD 工作流程。VM 則更適合需要完整 OS 級隔離或執行舊版軟體的應用程式。

### 4. 什麼是 Docker 映像？它的目的是什麼？

Docker 映像是用於創建 Docker 容器的唯讀模板。它包含執行應用程式所需的一切：應用程式程式碼、函式庫、系統工具、設定和環境變數。本質上，Docker 映像是環境的快照，確保應用程式在不同系統上一致執行。

Docker 映像的主要目的是為執行應用程式提供一致且可重現的環境。Docker 映像使開發人員能夠使用 Dockerfile 定義應用程式的環境，其中概述了建構映像所需的步驟。一旦建構完成，映像可以被共享、儲存和版本化，確保開發、測試和生產使用相同的環境。

映像是不可變的，這意味著一旦創建就無法修改。如果需要更改，將根據原始映像或修改的 Dockerfile 建構新映像。這種不可變性確保了 Docker 映像的可靠性和可預測性，特別是在持續整合和部署工作流程中。

Docker 映像通常儲存在 Docker 註冊表中，如 Docker Hub（預設的公共註冊表）。團隊也可以創建自己的私有註冊表以安全地儲存內部映像。

### 5. 什麼是 Docker 容器？

Docker 容器是 Docker 映像的實例，在輕量級虛擬化環境中作為隔離進程執行。容器包含執行應用程式所需的一切，包括應用程式程式碼、函式庫、執行時和依賴項。容器允許開發人員以標準化方式在不同環境中建構、傳輸和執行應用程式。

與傳統虛擬機不同，Docker 容器共享主機作業系統的核心，但彼此隔離執行。這使得容器在資源使用方面更高效，啟動速度比需要啟動整個作業系統的 VM 更快。

當你執行 Docker 容器時，Docker 取得相應的 Docker 映像，在其上創建可寫層，並啟動容器。這個容器化的應用程式無論在哪裡執行都以完全相同的方式運行。這消除了開發、測試和生產之間的環境不一致，確保應用程式無論底層系統如何都能按預期工作。

Docker 容器本質上是短暫的。這意味著容器可以輕鬆停止、銷毀和重新創建，而不會影響底層應用程式。這使得 Docker 容器非常適合微服務，其中需要獨立部署、擴展和更新小型獨立功能單元。

### 6. 什麼是 Dockerfile？

Dockerfile 是一個文字檔案，包含一系列用於建構 Docker 映像的指令。Dockerfile 中的每條指令都定義了組裝映像過程中的一個步驟。Dockerfile 用於自動化創建 Docker 映像，然後可用於執行容器。

Dockerfile 的主要目標是為你的 Docker 映像創建可重現的建構流程，確保每次建構映像時都遵循相同的步驟。Dockerfile 中的一些常見指令包括：

- **FROM**：指定基礎映像
- **RUN**：在映像中執行命令（如安裝軟體包）
- **COPY**：將檔案從主機複製到映像
- **WORKDIR**：設定容器內的工作目錄
- **CMD**：指定容器啟動時執行的預設命令
- **EXPOSE**：指定容器將監聽的連接埠

透過使用 Dockerfile，你可以以聲明方式定義應用程式的環境，使其更容易重現和維護。這在持續整合和持續部署流程中特別有用。

### 7. 什麼是 Docker 守護程式？

Docker 守護程式（也稱為 Docker 引擎）是一個後台服務，管理 Docker 容器的創建、執行和編排。它是 Docker 平台的核心組件，與作業系統互動以管理容器生命週期和資源。

Docker 守護程式的功能：
- 監聽來自 Docker CLI 或 API 的請求
- 管理 Docker 對象（映像、容器、網路、卷）
- 處理容器生命週期（啟動、停止、重啟容器）
- 管理映像建構和快取
- 促進容器之間的網路連接

Docker 守護程式可以作為系統上的服務執行，在多主機環境（如 Docker Swarm 或 Kubernetes 叢集）中執行時，它與其他 Docker 守護程式通訊。

### 8. 如何執行 Docker 容器？

要執行 Docker 容器，首先需要有一個 Docker 映像。一旦映像準備好，使用 `docker run` 命令從該映像啟動容器。基本語法是：

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARGUMENTS]
```

例如，要基於官方 nginx 映像執行容器：

```bash
docker run nginx
```

這將下載 nginx 映像（如果尚未下載）並基於它啟動一個容器。

你可以在 `docker run` 中傳遞各種選項來控制容器的行為：
- `-d`：在後台（分離模式）執行容器
- `-p`：將容器連接埠映射到主機連接埠
- `--name`：為容器指定名稱
- `-e`：設定環境變數
- `-v`：掛載卷或綁定掛載

一旦容器執行，你可以使用 `docker exec` 或 `docker attach` 命令與其互動。

### 9. 什麼是 Docker Hub？

Docker Hub 是一個基於雲的註冊表服務，允許你儲存、共享和管理 Docker 映像。它是 Docker 使用的預設註冊表，開發人員和組織可以上傳公共或私有 Docker 映像。

Docker Hub 提供的功能：
- **公共和私有儲存庫**：儲存公共映像或創建私有儲存庫
- **自動建構**：與 GitHub/Bitbucket 整合以自動建構映像
- **官方映像**：訪問由組織和軟體供應商維護的精選映像
- **協作**：與團隊成員共享映像
- **Webhooks**：在推送映像時觸發操作

Docker Hub 作為 Docker 映像的中央儲存庫，在個人和企業工作流程中被廣泛使用。

### 10. Docker 映像和 Docker 容器之間的區別？

Docker 映像是創建 Docker 容器的藍圖或模板。它包含執行應用程式所需的應用程式程式碼、函式庫和依賴項。映像是唯讀的，這意味著創建後無法修改。當你需要對映像進行更改時，你創建它的新版本。

另一方面，Docker 容器是 Docker 映像的執行實例。它是可寫的，可以執行映像中指定的應用程式。容器與主機機器和其他容器隔離，這確保它們在不同環境中一致執行。當創建容器時，Docker 在映像頂部添加一個可寫層，允許在容器執行期間發生更改（如寫入日誌或生成臨時檔案）。

總結：
- **映像**：靜態、唯讀的模板
- **容器**：映像的執行、可寫實例

兩者都是 Docker 生態系統不可或缺的部分，映像提供模板，容器作為執行環境。

## 基本操作

### 11. 如何停止執行中的 Docker 容器？

要停止執行中的 Docker 容器，使用 `docker stop` 命令，後跟容器 ID 或容器名稱。當你停止容器時，Docker 向容器的主進程發送 SIGTERM 信號，允許它優雅地終止。如果進程在指定的寬限期內沒有停止，Docker 會發送 SIGKILL 信號強制終止容器。

基本語法：

```bash
docker stop <container_id_or_name>
```

例如，停止名為 my_nginx_container 的容器：

```bash
docker stop my_nginx_container
```

或者，如果你想立即停止容器而不等待寬限期，可以使用 `docker kill` 命令，它向容器發送 SIGKILL 信號：

```bash
docker kill <container_id_or_name>
```

重要的是要注意，停止容器不會刪除它。你可以稍後使用 `docker start` 命令再次啟動同一容器。

### 12. 如何列出所有 Docker 容器？

要列出所有 Docker 容器，包括執行中和已停止的容器，使用帶有 `-a`（或 `--all`）選項的 `docker ps` 命令：

```bash
docker ps -a
```

此命令顯示系統上的所有容器，包括它們的狀態（執行中、已退出等）、容器 ID、名稱和其他詳細資訊。預設情況下，`docker ps` 命令僅顯示執行中的容器，但使用 `-a` 選項，它還包括已停止的容器。

例如：

```
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
123abc456def nginx "nginx -g 'daemon off;'" 2 hours ago Exited (0) 20 minutes ago my_nginx_container
```

你還可以使用其他標誌過濾輸出，如 `-q`（僅顯示容器 ID）或 `--filter`（根據狀態、名稱等過濾容器）。

### 13. 如何移除已停止的 Docker 容器？

要在 Docker 中移除已停止的容器，使用 `docker rm` 命令，後跟容器 ID 或容器名稱。這將從系統中移除容器，但不會移除相關的 Docker 映像。

基本語法：

```bash
docker rm <container_id_or_name>
```

例如，移除名為 my_nginx_container 的容器：

```bash
docker rm my_nginx_container
```

如果要一次移除多個容器，可以指定容器 ID 或名稱列表：

```bash
docker rm container1 container2 container3
```

如果要一次移除所有已停止的容器，可以使用以下命令：

```bash
docker rm $(docker ps -a -q)
```

這會移除所有當前未執行的容器。如果容器仍在執行，你需要先使用 `docker stop` 停止它。

### 14. 什麼是 Docker 卷及如何使用它？

Docker 卷是一種持久性儲存機制，用於儲存需要在容器之間共享或在容器重啟後保留的資料。卷儲存在主機檔案系統上，在容器的檔案系統之外，確保即使容器被移除或重新創建，資料也保持完整。

卷有用的幾個原因：
- **資料持久性**：即使容器停止或刪除，資料也會保留
- **在容器之間共享資料**：多個容器可以掛載同一個卷
- **效能**：卷比綁定掛載更高效
- **備份和恢復**：卷可以輕鬆備份和恢復

要在 Docker 中創建和使用卷，可以使用 `docker volume` 命令。例如，創建新卷：

```bash
docker volume create my_volume
```

然後，在執行容器時，可以使用 `-v` 標誌掛載卷：

```bash
docker run -v my_volume:/data my_image
```

這會將 my_volume 卷掛載到容器內的 /data 目錄。

### 15. 如何在 Docker 容器中管理資料？

在 Docker 容器中管理資料通常涉及使用卷、綁定掛載或在容器的檔案系統中儲存資料。但是，推薦的方法是使用 Docker 卷，因為它們提供更好的可攜性、資料持久性和管理。

管理資料的主要方式：

1. **Docker 卷**：由 Docker 管理並儲存在主機上的專用位置。卷是持久性資料的推薦方法。

2. **綁定掛載**：直接將主機目錄或檔案掛載到容器中。這在開發期間很有用，但不如卷可攜。

3. **tmpfs 掛載**：在記憶體中儲存資料，容器停止時資料消失。對於敏感資料或臨時資料有用。

例如，創建卷並將其掛載到容器中：

```bash
docker run -v my_data:/data my_image
```

這會將 my_data 卷掛載到容器內的 /data 目錄。

### 16. 什麼是 Docker Compose？

Docker Compose 是一個用於定義和執行多容器 Docker 應用程式的工具。使用 Compose，你可以在一個名為 `docker-compose.yml` 的 YAML 檔案中定義應用程式的所有服務、網路和卷。然後，你可以使用單個命令（`docker-compose up`）啟動檔案中定義的所有服務。

Docker Compose 特別適用於處理需要多個容器的應用程式，如具有前端、後端和資料庫的 Web 應用程式，以及可能的其他服務，如快取、訊息代理等。它透過允許你在一個地方定義容器的配置、依賴項和連接來簡化管理多個容器。

Docker Compose 的主要功能和優勢：
- **簡化配置**：在單個 YAML 檔案中定義所有服務
- **易於擴展**：輕鬆擴展服務
- **網路**：自動為服務創建網路
- **卷管理**：在服務之間定義和共享卷
- **環境管理**：使用環境變數配置服務

例如，一個基本的 docker-compose.yml 檔案可能如下所示：

```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: example
```

要啟動 Web 伺服器和資料庫，你只需執行：

```bash
docker-compose up
```

這將自動創建必要的容器並啟動它們，根據定義的配置連接它們。

### 17. 如何從 Dockerfile 創建 Docker 映像？

要從 Dockerfile 創建 Docker 映像，使用 `docker build` 命令。Dockerfile 包含如何組裝映像的指令，如使用哪個基礎映像、安裝哪些依賴項以及包含哪些檔案。

基本語法：

```bash
docker build -t <image_name>:<tag> <path_to_dockerfile>
```

例如，從當前目錄的 Dockerfile 建構映像並將其標記為 my_app:v1：

```bash
docker build -t my_app:v1 .
```

建構過程完成後，映像儲存在本地 Docker 映像快取中，你可以使用它創建容器。

### 18. 什麼是 Docker 網路？

Docker 網路是一個虛擬網路，允許 Docker 容器彼此通訊以及與外部世界通訊。Docker 使用不同類型的網路來管理容器之間的通訊並隔離它們之間的網路流量。

有幾種類型的 Docker 網路：

- **Bridge**：預設網路類型，為容器提供私有內部網路
- **Host**：容器共享主機的網路堆疊
- **None**：禁用容器的網路
- **Overlay**：用於 Docker Swarm 中跨多個主機的容器通訊
- **Macvlan**：為容器分配 MAC 地址，使其在網路上顯示為物理設備

你可以使用 `docker network create` 命令創建 Docker 網路。例如：

```bash
docker network create my_network
```

創建網路後，可以使用 `--network` 選項執行連接到該網路的容器：

```bash
docker run --network my_network my_image
```

網路有助於管理容器之間的通訊，特別是在多容器應用程式和微服務中。

### 19. docker ps 命令的用途是什麼？

`docker ps` 命令用於列出系統上當前執行的容器。它提供有關每個執行容器的基本資訊，包括：

- 容器 ID
- 映像名稱
- 創建時間
- 狀態
- 連接埠映射
- 容器名稱

預設情況下，`docker ps` 僅列出執行中的容器。要查看所有容器，包括已停止的容器，可以使用 `-a`（或 `--all`）標誌：

```bash
docker ps -a
```

要過濾清單，可以使用 `--filter` 選項根據特定條件（如狀態或名稱）顯示容器。

### 20. docker pull 命令的用途是什麼？

`docker pull` 命令用於從 Docker 註冊表（如 Docker Hub）下載 Docker 映像到本地機器。當你想要基於來自公共註冊表或私有註冊表的現有映像執行容器時，這通常是第一步。

語法：

```bash
docker pull <image_name>:<tag>
```

例如，從 Docker Hub 拉取最新的官方 nginx 映像：

```bash
docker pull nginx
```

如果你想要映像的特定版本，可以指定標籤。例如，拉取 nginx 映像的 1.18 版本：

```bash
docker pull nginx:1.18
```

一旦映像被拉取，就可以用來創建容器。如果映像尚未在本地系統上，Docker 將從指定的註冊表獲取它。

## 進階概念

### 21. 如何找到執行中 Docker 容器的 IP 地址？

要找到執行中 Docker 容器的 IP 地址，可以使用 `docker inspect` 命令，該命令提供有關容器的詳細資訊，包括其網路設定。具體來說，你需要從容器的網路介面提取 IP 地址。

基本語法：

```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_id_or_name>
```

例如，要獲取名為 my_container 的容器的 IP 地址：

```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my_container
```

此命令將返回 Docker 網路系統分配給容器的 IP 地址。如果容器附加到特定網路，Docker 會在該網路範圍內為其分配 IP 地址。

如果你想查看更詳細的網路資訊，可以省略 `-f` 標誌並檢查整個容器：

```bash
docker inspect my_container
```

這將返回包含容器網路詳細資訊（包括 IP 地址）的 JSON 輸出，位於 NetworkSettings 部分下。

### 22. docker run 和 docker exec 的區別是什麼？

`docker run` 和 `docker exec` 都用於與 Docker 容器互動，但它們服務於不同的目的：

**docker run**：用於從 Docker 映像創建並啟動新容器。它啟動一個新容器並執行指定的命令。

例如，基於 nginx 映像啟動新容器：

```bash
docker run -d -p 80:80 nginx
```

這會在分離模式（-d）下啟動新容器，並將主機的 80 連接埠映射到容器的 80 連接埠。

**docker exec**：用於在已經執行的容器內執行命令。它不會創建新容器，而是在現有容器的上下文中執行命令。

例如，在執行中的容器內開啟互動式 shell（bash）：

```bash
docker exec -it <container_id_or_name> bash
```

主要區別是 `docker run` 用於創建和啟動新容器，而 `docker exec` 用於在已經執行的容器中執行命令。

### 23. 使用 Docker 有哪些優勢？

Docker 提供了幾個優勢，使其成為現代軟體開發和部署的熱門選擇：

1. **可攜性**：容器在任何安裝了 Docker 的系統上一致執行
2. **一致性**：確保開發、測試和生產環境相同
3. **隔離**：容器彼此隔離，減少衝突
4. **效率**：容器輕量且快速啟動
5. **可擴展性**：輕鬆擴展應用程式
6. **版本控制**：映像可以版本化和回滾
7. **資源優化**：容器比 VM 使用更少的資源
8. **DevOps 整合**：與 CI/CD 流程無縫整合
9. **微服務支援**：非常適合微服務架構

### 24. docker logs 命令的用途是什麼？

`docker logs` 命令用於檢索執行中或已停止容器的日誌。這對於除錯或監視容器的行為特別有用，因為它顯示容器內執行的進程的輸出。

基本語法：

```bash
docker logs <container_id_or_name>
```

例如，查看名為 my_container 的容器的日誌：

```bash
docker logs my_container
```

預設情況下，`docker logs` 將顯示整個日誌輸出。你可以使用各種選項控制輸出：

- `-f`（follow）：持續串流日誌（類似於 Unix 系統中的 tail -f）
- `--tail`：僅顯示日誌的最後 N 行
- `--since`：顯示特定時間戳之後的日誌

日誌對於排除容器內的問題非常有用，如應用程式崩潰或意外行為。

### 25. 如何檢查 Docker 容器？

你可以使用 `docker inspect` 命令檢查 Docker 容器。此命令提供有關容器配置的詳細資訊，包括其設定、環境變數、網路等。輸出為 JSON 格式，包含有關容器的大量資料。

基本語法：

```bash
docker inspect <container_id_or_name>
```

例如：

```bash
docker inspect my_container
```

這將返回詳細的 JSON 輸出，其中包含有關容器的資訊，包括：

- 容器 ID 和名稱
- 映像資訊
- 狀態和執行時資訊
- 網路設定（IP 地址、連接埠等）
- 掛載的卷
- 環境變數

你也可以使用 `-f` 標誌從檢查輸出中過濾特定欄位。例如，要獲取容器的 IP 地址：

```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my_container
```

這只返回容器的 IP 地址，而不是整個 JSON 輸出。

### 26. docker build 命令的用途是什麼？

`docker build` 命令用於從 Dockerfile 創建 Docker 映像。Dockerfile 包含建構映像的指令，如指定基礎映像、複製檔案、安裝依賴項和設定環境變數。

基本語法：

```bash
docker build -t <image_name>:<tag> <path_to_dockerfile>
```

例如，從當前目錄的 Dockerfile 建構映像並將其標記為 my_app:v1：

```bash
docker build -t my_app:v1 .
```

此命令告訴 Docker 讀取當前目錄（.）中的 Dockerfile 並建構名為 my_app:v1 的映像。

`docker build` 的一些有用選項：
- `--no-cache`：不使用快取建構映像
- `--build-arg`：傳遞建構時變數
- `-f`：指定自訂 Dockerfile 名稱

`docker build` 命令通常用於持續整合 (CI) 流程中以自動化映像創建，確保跨環境的一致性。

### 27. Docker 中的環境變數是什麼？

Docker 中的環境變數是在容器環境中設定的變數，可以被容器內執行的應用程式使用。這些變數提供了一種配置應用程式行為或提供執行時配置的方法，而無需將值硬編碼到應用程式本身中。

環境變數通常用於：
- 配置應用程式設定
- 傳遞資料庫憑證
- 設定 API 金鑰
- 定義執行時環境（開發、生產等）

你可以在 Docker 中透過以下方式設定環境變數：

1. **在 Dockerfile 中**：使用 ENV 指令直接在映像中定義環境變數

```dockerfile
ENV MY_VAR=some_value
```

2. **在執行時**：使用 `docker run` 的 `-e` 標誌在執行容器時傳遞環境變數

```bash
docker run -e MY_VAR=some_value my_image
```

3. **從檔案**：使用 `--env-file` 選項在執行容器時從檔案載入環境變數

```bash
docker run --env-file .env my_image
```

### 28. 如何擴展 Docker 容器？

擴展 Docker 容器通常是指執行容器化服務的多個實例（副本）以處理增加的負載或確保高可用性。你可以手動擴展容器或使用如 Docker Swarm 或 Kubernetes 這樣的容器編排工具。

**手動擴展**：
要手動擴展服務，可以多次使用 `docker run` 命令啟動基於同一映像的單獨容器。

例如，執行基於同一映像的兩個容器：

```bash
docker run -d --name container1 my_image
docker run -d --name container2 my_image
```

**Docker Swarm 擴展**：
如果你使用 Docker Swarm 進行編排，可以透過更新服務的副本計數來擴展服務。例如，將名為 my_service 的服務擴展到 5 個副本：

```bash
docker service scale my_service=5
```

這確保了服務的五個實例在 swarm 節點上執行，提供更好的負載平衡和容錯能力。

### 29. 什麼是 Docker 註冊表？

Docker 註冊表是用於儲存和管理 Docker 映像的儲存庫。它作為共享、分發和儲存 Docker 映像的中心位置，使 Docker 使用者可以訪問它們。

有兩種類型的 Docker 註冊表：

1. **公共註冊表**：如 Docker Hub，任何人都可以訪問和下載映像
2. **私有註冊表**：組織可以設定自己的私有註冊表以安全地儲存內部映像

你可以使用 `docker push` 和 `docker pull` 命令與 Docker 註冊表互動。例如：

將映像推送到註冊表：

```bash
docker push my_image:latest
```

從註冊表拉取映像：

```bash
docker pull my_image:latest
```

### 30. 什麼是 Docker Swarm？

Docker Swarm 是 Docker 的原生叢集和編排解決方案，用於將一組 Docker 主機作為單個虛擬主機管理。它支援跨多個 Docker 節點（機器）創建、管理和擴展容器化應用程式。

Docker Swarm 的主要功能：

- **叢集管理**：將多個 Docker 主機組合成一個叢集
- **服務部署**：在叢集中部署和管理服務
- **負載平衡**：在容器之間自動分配流量
- **擴展**：輕鬆擴展或縮減服務
- **自我修復**：自動替換失敗的容器
- **滾動更新**：在不停機的情況下更新服務

你可以使用以下命令初始化 Docker Swarm 叢集：

```bash
docker swarm init
```

然後，你可以使用 Docker Swarm 命令部署服務、擴展它們並監視它們的健康狀況。Swarm 特別適用於管理大規模分散式應用程式。

### 31. Docker 容器的預設網路模式是什麼？

Docker 容器的預設網路模式是 **bridge** 網路。這是在容器創建期間未指定明確網路時的預設網路模式。

在這種模式下，Docker 在主機機器上創建一個虛擬網路橋接器（預設名為 bridge），容器連接到它。每個容器在這個橋接網路上獲得自己的 IP 地址，它們可以使用它們的 IP 地址或容器名稱彼此通訊。此外，Docker 自動將特定連接埠（如 80 或 8080）映射到主機機器，允許外部流量到達容器。

橋接網路適用於容器需要在單個主機內彼此通訊的場景。對於更進階的網路設定（如 Docker Swarm 中的多主機通訊或覆蓋網路），你可以選擇其他網路模式，如 host 或 overlay。

要檢查容器的預設網路，可以檢查容器：

```bash
docker inspect <container_id_or_name>
```

查看 NetworkSettings 部分，它將顯示容器預設連接到 bridge 網路。

### 32. 如何更新現有的 Docker 容器？

更新現有 Docker 容器通常涉及以下步驟，因為 Docker 容器被設計為不可變的。要更新容器，你通常需要：

1. **停止並移除現有容器**：使用 `docker stop` 命令停止容器，然後使用 `docker rm` 移除它

```bash
docker stop <container_id_or_name>
docker rm <container_id_or_name>
```

2. **拉取更新的映像**：如果更新與容器使用的映像相關，可以從 Docker 註冊表拉取最新版本的映像

```bash
docker pull <image_name>:<tag>
```

3. **重新創建容器**：一旦更新的映像可用，你可以從更新的映像創建新容器。該過程通常涉及指定與原始容器相同的配置選項，如連接埠綁定、卷掛載或環境變數

```bash
docker run -d -p 80:80 --name <new_container_name> <updated_image_name>:<tag>
```

如果你使用 Docker Compose，可以透過修改 `docker-compose.yml` 檔案並執行以下命令來更新容器：

```bash
docker-compose up -d
```

此命令將根據需要重建和重啟容器。

### 33. 如何檢查 Docker 版本？

要檢查系統上安裝的 Docker 版本，可以使用 `docker --version` 命令，或使用更長的形式 `docker version` 來獲取更詳細的資訊。

簡短版本檢查：

```bash
docker --version
```

這將返回類似以下的字串：

```
Docker version 20.10.7, build f0df350
```

對於更詳細的版本資訊，包括 Docker 客戶端和伺服器版本：

```bash
docker version
```

要檢查系統上 Docker 的狀態（即 Docker 守護程式是否正在執行），可以根據系統配置使用不同的命令：

在 Linux 系統上（使用 systemd），可以使用 systemctl 命令：

```bash
systemctl status docker
```

在 macOS 和 Windows 上，Docker Desktop 提供圖形使用者介面，你可以在其中查看 Docker 的狀態。或者，你可以使用以下命令從終端檢查 Docker 守護程式的狀態：

```bash
docker info
```

### 34. docker exec 命令的用途是什麼？

`docker exec` 命令用於在已經執行的 Docker 容器內執行新命令。它通常用於故障排除、除錯或在容器執行時與容器化應用程式互動。

`docker exec` 的基本語法：

```bash
docker exec [OPTIONS] <container_id_or_name> <command>
```

例如，在名為 my_container 的容器內執行互動式 shell（bash）：

```bash
docker exec -it my_container bash
```

這裡：
- `-i` 保持 STDIN 開啟
- `-t` 分配偽 TTY（終端）

你也可以使用 `docker exec` 在執行中的容器內執行一次性命令。例如，檢查容器內服務的狀態：

```bash
docker exec my_container systemctl status apache2
```

這允許你與容器的檔案系統互動、執行命令或檢查其當前狀態，而無需停止或重啟容器。

### 35. Docker 中的預設橋接網路是什麼？

在 Docker 中，預設橋接網路是 Docker 在 Docker 服務初始化時創建的特殊網路。它是容器在未指定其他網路時預設連接的私有內部網路。

橋接網路允許容器使用它們的內部 IP 地址彼此通訊，並將特定連接埠（如果配置）暴露給外部世界。此網路與主機網路隔離，這意味著除非設定了特定的連接埠映射，否則連接到橋接網路的容器無法從外部世界直接訪問。

要檢查預設橋接網路，可以使用：

```bash
docker network inspect bridge
```

這將顯示有關橋接網路的詳細資訊，包括其子網路、閘道和連接到它的容器。

預設情況下，你執行的所有 Docker 容器都連接到此網路，除非另有指定。

### 36. docker-compose.yml 檔案的目的是什麼？

`docker-compose.yml` 檔案由 Docker Compose 使用，用於定義和配置多容器 Docker 應用程式。它提供了一種簡單的方式在單個 YAML 檔案中定義應用程式所需的所有服務、網路和卷。

`docker-compose.yml` 的目的是：

- **定義服務**：指定應用程式所需的容器（服務）
- **配置網路**：定義服務如何通訊
- **管理卷**：指定持久性儲存
- **設定環境變數**：配置服務
- **簡化部署**：使用單個命令啟動整個應用程式堆疊

典型的 `docker-compose.yml` 檔案可能如下所示：

```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: example
```

使用此檔案，你可以透過執行以下命令啟動 web 和 db 服務：

```bash
docker-compose up
```

### 37. 如何拉取特定版本的 Docker 映像？

要拉取特定版本的 Docker 映像，你需要指定映像名稱和標籤。標籤用於區分同一映像的不同版本，通常表示映像內軟體的版本。

基本語法：

```bash
docker pull <image_name>:<tag>
```

例如，拉取 nginx 映像的 1.18 版本：

```bash
docker pull nginx:1.18
```

如果未指定標籤，Docker 將預設拉取 latest 標籤：

```bash
docker pull nginx
```

你還可以使用標籤拉取具有特定功能或配置的映像（例如，nginx:alpine 表示 Nginx 映像的輕量級版本）。

要列出映像的可用標籤，可以訪問 Docker Hub 上的映像頁面或使用 `docker search` 命令。

### 38. docker stats 命令的用途是什麼？

`docker stats` 命令用於顯示執行中容器的即時效能資料。它顯示每個容器的指標，如 CPU 使用率、記憶體使用率、網路 I/O 和磁碟 I/O。此命令對於監視容器資源使用情況和識別潛在的效能瓶頸很有用。

基本語法：

```bash
docker stats [OPTIONS] [CONTAINER...]
```

例如，查看所有執行中容器的即時統計資訊：

```bash
docker stats
```

查看特定容器的統計資訊：

```bash
docker stats my_container
```

此命令提供以下指標：

- **容器 ID/名稱**
- **CPU 百分比**
- **記憶體使用/限制**
- **記憶體百分比**
- **網路 I/O**
- **區塊 I/O**
- **PIDs**

`docker stats` 命令對於效能監視和優化很有用，特別是在生產環境中。

### 39. 如何在分離模式下執行 Docker 容器？

要在分離模式下執行 Docker 容器，你使用 `docker run` 命令的 `-d` 或 `--detach` 標誌。這會在後台執行容器，釋放你的終端，這樣你就可以繼續工作，而不會讓容器的輸出佔用控制台。

基本語法：

```bash
docker run -d <image_name>
```

例如，在分離模式下執行 nginx 映像：

```bash
docker run -d -p 80:80 nginx
```

這裡，`-d` 確保容器在後台執行，`-p 80:80` 將容器的 80 連接埠映射到主機機器的 80 連接埠。

一旦容器在分離模式下執行，Docker 將返回容器的 ID，允許你使用 `docker ps`、`docker stop` 或 `docker logs` 等命令進一步管理它。

### 40. 什麼是多階段 Docker 建構？

多階段 Docker 建構是一種透過減少映像大小和提高建構效率來優化 Docker 映像的技術。在多階段建構中，你可以在單個 Dockerfile 中定義多個階段，每個階段都有自己的基礎映像和一組指令。關鍵思想是你可以將構件從一個階段複製到另一個階段，允許你將建構環境與執行時環境分開。

在典型場景中，你可能需要在一個階段編譯應用程式（例如，Go 或 Node.js 應用程式），然後將編譯的構件複製到一個只包含執行時依賴項的更小的基礎映像中。

多階段 Dockerfile 的例子：

```dockerfile
# 階段 1：建構階段
FROM golang:1.16 AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp .

# 階段 2：最終映像
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/myapp .
CMD ["./myapp"]
```

在這個例子中：
- 第一階段使用 Go 映像編譯應用程式
- 第二階段使用輕量級 Alpine 映像，並從建構階段複製編譯的二進制檔案

多階段建構的主要優勢是你可以透過排除不必要的建構工具和依賴項來大幅減少最終 Docker 映像的大小。

## Docker Compose 與編排

### 41. 如何使用 Docker Compose 管理多容器環境？

Docker Compose 是一個允許你定義和管理多容器 Docker 應用程式的工具。它使用配置檔案（`docker-compose.yml`）來定義應用程式所需的所有服務（容器），包括它們的建構指令、網路、卷和環境變數。

透過使用 `docker-compose.yml`，你可以管理具有多個服務的複雜應用程式，如 Web 伺服器、資料庫、快取等，所有這些都在單個檔案中。使用單個命令（`docker-compose up`），你可以啟動檔案中定義的所有容器，配置它們彼此互動，並確保它們的依賴項正確設定。

Docker Compose 的主要功能：
- **簡化配置**：在單個 YAML 檔案中定義所有服務
- **易於啟動/停止**：使用單個命令管理所有容器
- **網路**：自動為服務創建隔離網路
- **卷管理**：輕鬆在服務之間共享資料
- **擴展**：輕鬆擴展服務

基本 `docker-compose.yml` 的例子：

```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"
    networks:
      - app-network
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
    networks:
      - app-network

networks:
  app-network:
```

**步驟**：

1. 啟動多容器應用程式：

```bash
docker-compose up
```

這將拉取映像（如果它們不存在）、創建容器並啟動它們。預設情況下，它將在前台執行。要在後台執行，使用 `-d` 標誌：

```bash
docker-compose up -d
```

2. 停止服務：

```bash
docker-compose down
```

3. 擴展服務（例如，執行 web 服務的 3 個實例）：

```bash
docker-compose up --scale web=3
```

### 42. Dockerfile 建構參數是什麼？

Dockerfile 建構參數是可以在建構時傳遞的變數，用於自訂映像建構過程。它們使用 ARG 指令定義，可用於配置 Docker 映像的某些方面，如環境變數、建構路徑或版本號。

**定義建構參數**：你使用 Dockerfile 中的 ARG 指令定義建構參數。這是一個例子：

```dockerfile
ARG MY_VAR=default_value
FROM ubuntu
RUN echo "The value of MY_VAR is $MY_VAR"
```

**傳遞建構參數**：在建構 Docker 映像時，你可以使用 `--build-arg` 標誌傳遞建構參數：

```bash
docker build --build-arg MY_VAR=custom_value -t my-image .
```

建構參數對於創建靈活的 Dockerfile 很有用，這些 Dockerfile 可以根據建構時傳遞的參數針對不同環境或配置進行自訂。

### 43. 如何在 Docker 容器之間共享資料？

有幾種方式可以在 Docker 容器之間共享資料：

**1. Docker 卷**：
你可以將同一個卷掛載到多個容器中，允許它們共享資料：

```bash
docker run -v my_shared_volume:/data container1
docker run -v my_shared_volume:/data container2
```

**2. 綁定掛載**：
綁定掛載允許容器訪問主機系統上的檔案或目錄。這些在你希望容器與主機上的檔案或其他容器共享資料時很有用：

```bash
docker run -v /path/on/host:/path/in/container my-image
```

**3. 容器間網路**：
容器可以透過網路連接彼此通訊，透過 API 或共享服務交換資料。

**4. 資料卷容器**：
你可以創建專門用於儲存資料的容器，並將其卷掛載到其他容器中。

使用卷是在容器之間共享資料的推薦方法，因為它們由 Docker 管理並提供更好的效能和可攜性。

### 44. Docker 如何用於 CI/CD 流程？

Docker 在 CI/CD 流程中被廣泛用於一致、可重複的建構、測試和部署。以下是 Docker 如何融入 CI/CD 流程：

**1. 建構階段**：
- 開發人員將程式碼提交到版本控制系統（如 Git）
- CI 工具（Jenkins、GitLab CI、CircleCI）觸發建構
- Docker 映像從 Dockerfile 建構，確保一致的環境

**2. 測試階段**：
- 從建構的映像創建容器
- 在容器內執行自動化測試
- 容器提供隔離的測試環境

**3. 推送階段**：
- 成功的建構被標記並推送到 Docker 註冊表（Docker Hub、私有註冊表）
- 映像被版本化以便追蹤

**4. 部署階段**：
- 映像從註冊表拉取到生產環境
- 容器使用編排工具（Kubernetes、Docker Swarm）部署
- 可以實現滾動更新以實現零停機時間

**5. 監視和回滾**：
- 監視容器的健康和效能
- 如果出現問題，輕鬆回滾到以前的映像版本

Docker 確保「在我的機器上可以運行」的問題被消除，因為相同的容器映像在開發、測試和生產中使用。

### 45. docker pull 和 docker push 的區別是什麼？

- **docker pull**：`docker pull` 命令用於從 Docker 註冊表（如 Docker Hub 或私有註冊表）下載映像到本地機器。例如：

```bash
docker pull ubuntu:latest
```

- **docker push**：`docker push` 命令將本地映像上傳到 Docker 註冊表。這通常用於共享映像或在生產環境中部署它們。在推送映像之前，你需要使用適當的註冊表地址標記它：

```bash
docker tag my-image my-repo/my-image:latest
docker push my-repo/my-image:latest
```

總結：
- `pull` 用於下載映像
- `push` 用於上傳/發布映像

### 46. Docker 在微服務架構中的作用是什麼？

在微服務架構中，應用程式被分解為更小的獨立服務，每個服務都有自己的功能和資料庫。Docker 在促進微服務的開發、部署和擴展方面發揮著關鍵作用：

**1. 隔離**：
每個微服務在自己的容器中執行，確保隔離和獨立性。這允許不同的服務使用不同的技術堆疊。

**2. 可攜性**：
Docker 容器可以在任何環境中一致執行，使微服務易於在開發、測試和生產之間移動。

**3. 可擴展性**：
單個微服務可以獨立擴展。如果一個服務遇到高流量，你可以擴展該服務的容器實例，而不影響其他服務。

**4. 快速部署**：
容器啟動速度快，允許快速部署和更新微服務。

**5. 版本控制**：
每個微服務可以獨立版本化和更新，無需重新部署整個應用程式。

**6. 編排**：
Docker 與編排工具（如 Kubernetes 和 Docker Swarm）配合良好，這些工具有助於大規模管理微服務，確保自動化部署、擴展和監視。

### 47. 如何排除無法啟動的 Docker 容器？

排除無法啟動的 Docker 容器涉及幾個步驟來診斷和解決問題：

**1. 檢查容器日誌**：
使用 `docker logs` 命令查看容器的日誌，這些日誌通常提供有用的錯誤訊息，解釋容器為何無法啟動。

```bash
docker logs <container_id>
```

**2. 檢查容器狀態**：
執行 `docker ps -a` 查看所有容器，包括已停止的容器。檢查容器是否意外退出，並注意退出程式碼。

```bash
docker ps -a
```

**3. 檢查 Dockerfile**：
查看 Dockerfile 中的錯誤，如缺少依賴項、錯誤的基礎映像或配置錯誤的入口點/CMD。

**4. 檢查連接埠衝突**：
確保容器嘗試使用的連接埠未被其他容器或主機上的進程使用。

**5. 檢查資源限制**：
驗證主機機器是否有足夠的資源（CPU、記憶體）來執行容器。

**6. 檢查 Docker 守護程式日誌**：
查看 Docker 守護程式日誌以查找可能表示 Docker 本身問題的任何錯誤或警告。

```bash
journalctl -u docker.service
```

**7. 互動式執行**：
嘗試使用互動式 shell 執行容器以手動診斷問題：

```bash
docker run -it <image_name> /bin/bash
```

透過遵循這些步驟，你通常可以確定並修復導致容器無法啟動的問題。

### 48. 什麼是 Docker Desktop，它如何用於本地開發？

Docker Desktop 是一個工具，為在本地機器（Windows 和 macOS）上管理 Docker 容器、映像和 Docker Compose 設定提供易於使用的介面。它簡化了在本地開發環境中執行 Docker 的過程，因為它包含必要的 Docker 引擎和為開發人員量身定制的附加功能。

Docker Desktop 的主要功能：

- **整合開發環境**：提供圖形介面來管理容器和映像
- **Docker Compose 支援**：內建對多容器應用程式的支援
- **Kubernetes 整合**：可選的本地 Kubernetes 叢集
- **檔案共享**：在主機和容器之間輕鬆共享檔案
- **跨平台**：在 Windows、macOS 和 Linux 上一致工作
- **資源管理**：控制 Docker 可以使用的 CPU 和記憶體

對於本地開發，Docker Desktop 消除了對虛擬機或複雜配置的需求，提供了一個環境，開發人員可以在其中建構、測試和共享應用程式，並在不同環境中保持一致。

### 49. Docker 中的映像層是什麼？

Docker 中的映像層是構成 Docker 映像的構建塊。每一層代表對映像檔案系統的一組變更（如安裝套件或新增檔案）。Docker 使用層來優化映像儲存、共享和重用。

關於 Docker 映像層的關鍵點：

- **層疊結構**：每個 Dockerfile 指令創建一個新層
- **不可變性**：層創建後無法更改
- **共享**：多個映像可以共享相同的基礎層
- **快取**：Docker 快取層以加快建構速度
- **大小優化**：每一層只儲存與前一層的差異

例如，考慮這個 Dockerfile：

```dockerfile
FROM ubuntu          # 層 1：基礎映像
RUN apt-get update   # 層 2：更新套件列表
RUN apt-get install -y nginx  # 層 3：安裝 nginx
COPY index.html /var/www/html/  # 層 4：複製檔案
```

每個指令創建一個新層。如果你修改 `index.html` 並重建映像，Docker 只需要重建層 4，因為前三層被快取。

這種分層方法使 Docker 映像高效且快速建構，特別是在使用共同基礎映像時。

### 50. 如何在 Docker 中管理容器日誌？

在 Docker 中管理容器日誌對於除錯、監視和審計容器行為至關重要。Docker 提供了幾種處理容器日誌的方式：

**1. 預設日誌驅動程式（json-file）**：
預設情況下，Docker 使用 json-file 日誌驅動程式，它將日誌以 JSON 格式儲存在主機檔案系統上。你可以使用以下命令查看特定容器的日誌：

```bash
docker logs <container_id>
```

**2. 日誌驅動程式**：
Docker 支援多種日誌驅動程式以適應不同的需求：
- `json-file`（預設）：儲存在本地 JSON 檔案中
- `syslog`：發送日誌到 syslog 伺服器
- `journald`：發送到 systemd journal
- `gelf`：發送到 Graylog
- `fluentd`：發送到 Fluentd
- `awslogs`：發送到 AWS CloudWatch

要指定日誌驅動程式，在 `docker run` 命令中使用 `--log-driver` 標誌：

```bash
docker run --log-driver=syslog my-image
```

**3. 日誌聚合工具**：
對於生產環境，使用專門的日誌聚合工具：
- ELK Stack（Elasticsearch、Logstash、Kibana）
- Splunk
- Datadog
- New Relic

**4. 掛載日誌卷**：
你可以將日誌目錄掛載到主機：

```bash
docker run -v /host/logs:/container/logs my-image
```

**5. 查看和過濾日誌**：
使用 `docker logs` 查看容器日誌：

```bash
docker logs -f <container_id>  # 跟隨日誌
docker logs --tail 100 <container_id>  # 最後 100 行
docker logs --since 2h <container_id>  # 過去 2 小時的日誌
```

**6. 日誌輪替**：
Docker 提供了配置日誌輪替的方式，以防止日誌檔案變得太大。例如，使用 json-file 日誌驅動程式的 max-size 和 max-file 選項：

```bash
docker run --log-opt max-size=10m --log-opt max-file=3 my-image
```

### 51. docker-compose.override.yml 檔案的目的是什麼？

`docker-compose.override.yml` 檔案是 Docker Compose 中使用的可選配置檔案，用於覆蓋或擴展主要 `docker-compose.yml` 檔案中定義的設定。它允許你定義特定於環境的配置，使維護開發、測試和生產環境的不同配置變得更容易。

關於 `docker-compose.override.yml` 的關鍵點：

- **自動合併**：Docker Compose 自動讀取並合併 `docker-compose.override.yml`
- **環境特定配置**：允許在不修改主要 compose 檔案的情況下進行本地自訂
- **開發覆蓋**：常用於開發特定設定，如卷掛載或連接埠映射
- **不提交到版本控制**：通常不提交到 Git，因為它是本地的

**範例**：

`docker-compose.yml`：

```yaml
version: '3'
services:
  web:
    image: my-web-app
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
```

`docker-compose.override.yml`：

```yaml
version: '3'
services:
  web:
    environment:
      - NODE_ENV=development
    ports:
      - "3000:80"
    volumes:
      - ./src:/app/src
```

當你執行 `docker-compose up` 時，Docker Compose 會自動合併這兩個檔案，使用覆蓋檔案中的值。

如果你想指定自訂覆蓋檔案，使用 `-f` 標誌：

```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
```

### 52. docker network create 命令的用途是什麼？

`docker network create` 命令用於在 Docker 中創建自訂網路。這允許你定義容器如何彼此通訊以及與外部世界通訊。預設情況下，容器連接到橋接網路，但創建自訂網路可以改善隔離、安全性和複雜應用程式中的服務發現。

關於 `docker network create` 的關鍵點：

- **自訂網路**：為特定需求創建專用網路
- **服務發現**：容器可以使用名稱解析彼此
- **隔離**：在不同網路上的容器無法通訊
- **多個驅動程式**：支援 bridge、overlay、macvlan 等

**基本語法**：

```bash
docker network create --driver bridge my_network
```

**範例**：創建自訂網路並在其上執行容器：

```bash
# 創建網路
docker network create --driver bridge my_custom_network

# 在自訂網路上執行容器
docker run --network my_custom_network -d --name web nginx
docker run --network my_custom_network -d --name db mysql

# 檢查網路
docker network inspect my_custom_network
```

自訂網路允許同一網路上的容器使用容器名稱彼此通訊，而無需知道 IP 地址。

### 53. 如何將環境變數暴露給 Docker 容器？

環境變數可以透過幾種方式暴露給 Docker 容器。這些變數可以在執行時配置容器，通常用於資料庫憑證、API 金鑰或服務特定配置等內容。

**1. 使用 -e 標誌**：
你可以在 `docker run` 命令中使用 `-e` 標誌設定單個環境變數：

```bash
docker run -e MY_VAR=value my_image
```

**2. 使用 .env 檔案**：
你可以將環境變數儲存在 `.env` 檔案中，並在 Docker Compose 或 `docker run` 中引用它。這對於管理多個變數很有用。

範例 `.env` 檔案：

```
MY_VAR=value
ANOTHER_VAR=value2
```

使用 Docker Compose，`.env` 檔案會自動讀取：

```yaml
version: '3'
services:
  web:
    image: my_image
    environment:
      - MY_VAR
      - ANOTHER_VAR
```

**3. 使用 docker-compose.yml**：
你可以直接在 `docker-compose.yml` 檔案的 `environment` 部分指定環境變數：

```yaml
services:
  web:
    image: my_image
    environment:
      - MY_VAR=value
      - ANOTHER_VAR=value2
```

**4. Dockerfile ENV 指令**：
你也可以使用 ENV 指令在 Dockerfile 中指定預設環境變數：

```dockerfile
ENV MY_VAR=value
ENV ANOTHER_VAR=value2
```

**5. 使用 --env-file**：
在執行容器時從檔案載入環境變數：

```bash
docker run --env-file .env my_image
```

### 54. 如何使用 docker inspect 進行除錯？

`docker inspect` 命令是一個強大的除錯工具，提供有關 Docker 容器或映像的詳細資訊，如其配置、狀態、卷、網路設定等。

**docker inspect 的主要用途**：

**1. 容器和映像資訊**：
你可以檢查容器、映像、卷、網路等。例如：

```bash
docker inspect <container_id>
docker inspect <image_name>
```

**2. 提取特定資訊**：
使用 `--format` 標誌提取特定欄位：

```bash
# 獲取容器的 IP 地址
docker inspect --format '{{ .NetworkSettings.IPAddress }}' <container_id>

# 獲取容器狀態
docker inspect --format '{{ .State.Status }}' <container_id>

# 獲取環境變數
docker inspect --format '{{ .Config.Env }}' <container_id>
```

**3. 除錯網路問題**：
檢查容器的網路設定：

```bash
docker inspect --format '{{ .NetworkSettings }}' <container_id>
```

**4. 檢查卷掛載**：

```bash
docker inspect --format '{{ .Mounts }}' <container_id>
```

**5. 查看完整配置**：
獲取 JSON 格式的完整輸出：

```bash
docker inspect <container_id> | jq
```

**範例除錯場景**：

```bash
# 檢查容器為何無法啟動
docker inspect <container_id> | grep -A 10 "State"

# 查看連接埠映射
docker inspect --format '{{ .NetworkSettings.Ports }}' <container_id>

# 檢查容器的日誌路徑
docker inspect --format '{{ .LogPath }}' <container_id>
```

### 55. 如何清理 Docker 環境？

要保持 Docker 環境清潔並釋放不必要的磁碟空間，你應該定期移除未使用的資源，如映像、容器和卷。

**1. 移除已停止的容器**：

```bash
docker container prune
```

確認後移除所有已停止的容器。

**2. 移除未使用的映像**：

```bash
docker image prune
```

要移除所有當前未使用的映像：

```bash
docker image prune -a
```

**3. 移除未使用的卷**：

```bash
docker volume prune
```

這會移除任何容器不再使用的卷。

**4. 移除所有未使用的資源**：
清理所有內容（已停止的容器、未使用的映像、未使用的卷）：

```bash
docker system prune
```

添加 `-a` 標誌以移除所有未使用的映像（不僅僅是懸掛的映像）：

```bash
docker system prune -a
```

**5. 檢查磁碟使用情況**：

```bash
docker system df
```

這顯示 Docker 使用的磁碟空間。

**6. 移除特定資源**：

```bash
# 移除特定容器
docker rm <container_id>

# 移除特定映像
docker rmi <image_id>

# 移除特定卷
docker volume rm <volume_name>

# 移除特定網路
docker network rm <network_name>
```

定期清理可以防止磁碟空間問題並保持 Docker 環境的高效性。

### 56. Docker 容器的不同狀態是什麼？

Docker 容器可以處於各種狀態，取決於它們的生命週期。主要容器狀態是：

**1. Created（已創建）**：
容器已創建但尚未啟動。這是在執行 `docker create` 後的狀態。

**2. Running（執行中）**：
容器正在執行。容器的主進程正在執行。

**3. Paused（已暫停）**：
容器的進程已暫停。使用 `docker pause` 暫停容器。

**4. Restarting（重啟中）**：
容器正在重啟過程中。

**5. Exited/Stopped（已退出/已停止）**：
容器已停止執行。主進程已終止。容器可以使用 `docker start` 重啟。

**6. Dead（已死亡）**：
容器處於非功能狀態。這通常發生在容器無法移除或存在 Docker 守護程式問題時。

**檢查容器狀態**：

```bash
docker ps -a
```

此命令列出所有容器，包括已停止或退出的容器。

**狀態轉換範例**：

```bash
# 創建容器（Created 狀態）
docker create --name my_container nginx

# 啟動容器（Running 狀態）
docker start my_container

# 暫停容器（Paused 狀態）
docker pause my_container

# 取消暫停容器（回到 Running）
docker unpause my_container

# 停止容器（Exited 狀態）
docker stop my_container

# 移除容器
docker rm my_container
```

### 57. 如何配置 Docker 容器自動重啟？

Docker 允許你使用重啟策略配置自動容器重啟。這些策略決定容器退出、失敗或 Docker 守護程式重啟時是否以及何時應重啟容器。

**重啟策略**：

**1. no（預設）**：
容器不會自動重啟。

**2. on-failure[:max-retries]**：
僅在容器以非零退出程式碼退出時重啟。可選地指定最大重試次數。

**3. always**：
始終重啟容器，無論退出狀態如何。如果手動停止，僅在 Docker 守護程式重啟時重啟。

**4. unless-stopped**：
類似於 always，但如果容器被手動停止，即使 Docker 守護程式重啟也不會重啟。

**範例**：

配置容器始終重啟：

```bash
docker run --restart=always my-image
```

配置容器僅在失敗時重啟，最多 3 次重試：

```bash
docker run --restart=on-failure:3 my-image
```

**Docker Compose**：
在 `docker-compose.yml` 檔案中，你可以在 `restart` 鍵下配置重啟策略：

```yaml
services:
  web:
    image: my-image
    restart: always
```

**更新現有容器的重啟策略**：

```bash
docker update --restart=always <container_id>
```

透過配置重啟策略，你可以確保容器對故障具有彈性並保持可用。

## 安全性與進階主題

### 58. 如何在生產環境中管理 Docker 容器安全性？

在生產環境中管理 Docker 容器安全性需要最佳實踐、配置管理和工具的組合，以最小化漏洞並確保容器被隔離和安全。主要策略包括：

**1. 使用最小基礎映像**：
使用最小基礎映像（如 Alpine Linux）減少攻擊面：

```dockerfile
FROM alpine:latest
```

**2. 以非 root 使用者執行容器**：
避免以 root 執行容器。在 Dockerfile 中創建並使用非特權使用者：

```dockerfile
RUN adduser -D myuser
USER myuser
```

**3. 掃描映像漏洞**：
使用工具掃描映像中的已知漏洞：
- Docker Scan
- Trivy
- Clair
- Snyk

```bash
docker scan my-image
trivy image my-image
```

**4. 限制容器功能**：
使用 `--cap-drop` 和 `--cap-add` 移除不必要的 Linux 功能：

```bash
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE my-image
```

**5. 使用唯讀檔案系統**：
當可能時，使用唯讀檔案系統執行容器：

```bash
docker run --read-only my-image
```

**6. 實施資源限制**：
限制容器可以使用的 CPU 和記憶體：

```bash
docker run --memory="512m" --cpus="1.0" my-image
```

**7. 使用 Docker Secrets**：
對於敏感資料，使用 Docker Secrets（在 Swarm 中）或 Kubernetes Secrets：

```bash
echo "mysecret" | docker secret create my_secret -
docker service create --secret my_secret my-image
```

**8. 啟用 Docker Content Trust**：
啟用 Content Trust 以確保映像的真實性：

```bash
export DOCKER_CONTENT_TRUST=1
```

**9. 網路隔離**：
使用自訂網路隔離容器並限制不必要的通訊。

**10. 定期更新**：
保持 Docker、基礎映像和依賴項更新以修補安全漏洞。

**11. 使用安全掃描器**：
整合安全掃描到 CI/CD 流程：

```bash
# 在 CI 流程中
docker build -t my-image .
trivy image my-image
```

**12. 實施日誌記錄和監視**：
使用日誌記錄和監視工具追蹤容器行為並檢測異常。

### 59. 如何配置 Docker 以實現高可用性和容錯？

配置 Docker 以實現高可用性 (HA) 和容錯涉及設計容器化應用程式，以確保它們在故障時保持可用並能夠處理增加的負載。這可以透過各種策略實現，通常利用如 Docker Swarm 或 Kubernetes 這樣的編排工具。以下是主要技術：

**1. 使用容器編排**：
使用 Docker Swarm 或 Kubernetes 自動化部署、擴展和故障轉移。

**Docker Swarm 範例**：

```bash
# 初始化 Swarm
docker swarm init

# 部署具有多個副本的服務
docker service create --replicas 3 --name my-service my-image

# 擴展服務
docker service scale my-service=5
```

**2. 多副本部署**：
在 Docker Swarm 中，使用 `--replicas` 選項部署服務時確保多個實例執行。如果一個實例失敗，另一個將接管：

```bash
docker service create --replicas 3 --name my-service my-image
```

**3. 健康檢查**：
在 Dockerfile 或 Docker Compose 中配置健康檢查以自動檢測和重啟不健康的容器：

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
```

**4. 滾動更新**：
實施滾動更新以在不停機的情況下更新服務：

```bash
docker service update --image my-image:v2 my-service
```

**5. 負載平衡**：
Docker Swarm 和 Kubernetes 提供內建負載平衡，在服務的多個副本之間分配流量。

**6. 資料複製**：
對於有狀態服務，使用資料複製確保資料在多個節點上可用。

**7. 節點冗餘**：
在多個節點上執行 Docker Swarm 或 Kubernetes 叢集以確保單個節點故障不會導致服務中斷。

**8. 監視和警報**：
使用監視工具（Prometheus、Grafana、Datadog）追蹤容器健康和效能，並在出現問題時設定警報。

**9. 備份和災難恢復**：
定期備份關鍵資料和配置。實施災難恢復計劃以從重大故障中恢復。

### 60. 如何設定私有 Docker 註冊表？

Docker 註冊表是用於 Docker 映像的儲存和分發系統。它允許你儲存和檢索映像，然後可以拉取這些映像來執行容器。Docker Hub 是預設的公共註冊表，但你也可以創建私有註冊表用於內部使用。

**設定私有註冊表**：

Docker 提供 `registry` 映像來設定私有註冊表。你可以將其作為容器拉取並執行：

**1. 執行註冊表容器**：

```bash
docker run -d -p 5000:5000 --name registry registry:2
```

這會在連接埠 5000 上啟動一個基本的私有註冊表。

**2. 標記並推送映像**：
標記映像並將其推送到私有註冊表：

```bash
# 標記映像
docker tag my-image localhost:5000/my-image

# 推送到私有註冊表
docker push localhost:5000/my-image
```

**3. 從私有註冊表拉取**：

```bash
docker pull localhost:5000/my-image
```

**4. 使用持久性儲存**：
要持久化註冊表資料，掛載卷：

```bash
docker run -d -p 5000:5000 \
  -v /path/on/host:/var/lib/registry \
  --name registry registry:2
```

**5. 使用 TLS 保護註冊表**：
對於生產環境，使用 TLS 保護註冊表：

```bash
docker run -d -p 5000:5000 \
  -v /path/to/certs:/certs \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
  --name registry registry:2
```

**6. 添加身份驗證**：
使用 htpasswd 添加基本身份驗證：

```bash
# 創建密碼檔案
htpasswd -Bc registry.password myuser

# 執行帶身份驗證的註冊表
docker run -d -p 5000:5000 \
  -v /path/to/auth:/auth \
  -e REGISTRY_AUTH=htpasswd \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/registry.password \
  --name registry registry:2
```

### 61. 如何使用 Docker 和 Kubernetes 設定 CI/CD 流程？

使用 Docker 和 Kubernetes 設定 CI/CD 流程，一般過程涉及自動化建構、測試和部署容器化應用程式的步驟。你可以使用流行的 CI/CD 工具，如 Jenkins、GitLab CI 或 CircleCI。以下是該過程的高層次概述：

**1. 原始碼管理**：
- 將程式碼儲存在 Git 儲存庫（GitHub、GitLab、Bitbucket）中
- 使用分支策略（Git Flow、功能分支）

**2. CI 流程（持續整合）**：

**步驟 1**：開發人員將程式碼推送到儲存庫
**步驟 2**：CI 工具偵測更改並觸發建構
**步驟 3**：建構 Docker 映像：

```bash
docker build -t my-app:$BUILD_NUMBER .
```

**步驟 4**：執行測試：

```bash
docker run my-app:$BUILD_NUMBER npm test
```

**步驟 5**：掃描漏洞：

```bash
trivy image my-app:$BUILD_NUMBER
```

**步驟 6**：推送到註冊表：

```bash
docker push my-registry/my-app:$BUILD_NUMBER
```

**3. CD 流程（持續部署）**：

**步驟 1**：從註冊表拉取映像
**步驟 2**：使用 kubectl 或 Helm 部署到 Kubernetes：

```bash
kubectl set image deployment/my-app my-app=my-registry/my-app:$BUILD_NUMBER
```

或使用 Helm：

```bash
helm upgrade my-app ./my-chart --set image.tag=$BUILD_NUMBER
```

**步驟 3**：執行健康檢查和冒煙測試
**步驟 4**：如果部署失敗，回滾：

```bash
kubectl rollout undo deployment/my-app
```

**4. 範例 Jenkins 流程檔案**：

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t my-app:${BUILD_NUMBER} .'
            }
        }
        stage('Test') {
            steps {
                sh 'docker run my-app:${BUILD_NUMBER} npm test'
            }
        }
        stage('Scan') {
            steps {
                sh 'trivy image my-app:${BUILD_NUMBER}'
            }
        }
        stage('Push') {
            steps {
                sh 'docker push my-registry/my-app:${BUILD_NUMBER}'
            }
        }
        stage('Deploy') {
            steps {
                sh 'kubectl set image deployment/my-app my-app=my-registry/my-app:${BUILD_NUMBER}'
            }
        }
    }
}
```

### 62. 什麼是 Docker in Docker (DinD)？

Docker in Docker (DinD) 是在 Docker 容器內執行 Docker 的概念。這在你需要在容器化環境中執行 Docker 命令或甚至建構 Docker 映像的場景中很有用。

**常見用例包括**：

- **CI/CD 流程**：在容器化的 CI 環境中建構 Docker 映像
- **測試**：測試 Docker 相關功能
- **開發環境**：提供隔離的 Docker 環境

**如何使用 DinD**：

要執行 Docker in Docker，你可以使用官方的 `docker:dind` 映像：

```bash
docker run --privileged -d --name dind docker:dind
```

然後，你可以在這個容器內執行 Docker 命令：

```bash
docker exec -it dind docker ps
```

**在 CI/CD 中使用 DinD（GitLab CI 範例）**：

```yaml
build:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t my-image .
    - docker push my-image
```

**注意事項**：
然而，DinD 應謹慎使用，因為在 Docker 內部執行 Docker 可能會帶來安全風險和管理 Docker 守護程式的複雜性。像 Docker-outside-Docker (DoD) 這樣的替代方案通常更受青睞，其中容器透過套接字綁定與主機 Docker 守護程式通訊，而不是嵌套 Docker 守護程式。

**Docker-outside-Docker (DoD) 範例**：

```bash
docker run -v /var/run/docker.sock:/var/run/docker.sock docker:latest docker ps
```

這將主機的 Docker 套接字掛載到容器中，允許容器使用主機的 Docker 守護程式。

### 63. Kubernetes 和 Docker Swarm 的區別是什麼？

Kubernetes 和 Docker Swarm 都是用於管理容器化應用程式的編排平台。然而，它們在複雜性、可擴展性和功能方面有顯著差異：

**Docker Swarm**：

**優點**：
- 更簡單易用，學習曲線更平緩
- 與 Docker CLI 和 API 原生整合
- 設定和配置更快
- 適用於較小的部署和較簡單的應用程式
- 內建於 Docker Engine 中

**缺點**：
- 功能集較少
- 社群和生態系統較小
- 擴展能力有限

**Kubernetes**：

**優點**：
- 功能豐富且高度可擴展
- 大型社群和生態系統
- 進階功能（自動擴展、滾動更新、自我修復）
- 更好的多雲支援
- 行業標準，廣泛採用

**缺點**：
- 更複雜，學習曲線陡峭
- 需要更多資源和配置
- 初始設定可能具有挑戰性

**主要差異總結**：

| 功能 | Docker Swarm | Kubernetes |
|------|--------------|------------|
| 複雜性 | 簡單 | 複雜 |
| 學習曲線 | 溫和 | 陡峭 |
| 擴展性 | 良好 | 優秀 |
| 社群 | 較小 | 大型且活躍 |
| 功能 | 基本 | 進階 |
| 設定 | 快速 | 耗時 |
| 用例 | 中小型應用 | 企業級應用 |

**總結**：Kubernetes 功能更豐富、可擴展性更強，更適合複雜和高流量的應用程式。Docker Swarm 更簡單易用，更適合較小的設定或已經依賴 Docker 的環境。

### 64. 什麼是 Docker 映像漏洞，如何掃描它？

Docker 映像漏洞是指 Docker 映像中包含的軟體套件中的安全問題或弱點。這些可能是過時套件、未修補的漏洞或映像中配置錯誤的形式。

**掃描 Docker 映像漏洞的方法**：

**1. Docker Scan（內建）**：
Docker 提供了內建的掃描功能，由 Snyk 提供支援：

```bash
docker scan my-image
```

**2. Trivy**：
Trivy 是一個流行的開源漏洞掃描器：

```bash
# 安裝 Trivy
apt-get install trivy

# 掃描映像
trivy image my-image

# 僅顯示高嚴重性和關鍵性漏洞
trivy image --severity HIGH,CRITICAL my-image
```

**3. Clair**：
Clair 是另一個用於靜態分析容器漏洞的開源工具：

```bash
# 使用 Docker 執行 Clair
docker run -d --name clair quay.io/coreos/clair
```

**4. Anchore**：
Anchore 提供深入的映像分析和策略執行：

```bash
anchore-cli image add my-image
anchore-cli image vuln my-image os
```

**5. Snyk**：
Snyk 提供全面的容器安全：

```bash
snyk container test my-image
```

**整合到 CI/CD**：
將漏洞掃描添加為 CI/CD 流程的一部分，以便每個映像在部署前都經過檢查。例如，在 CI 流程中使用 Trivy：

```bash
trivy image my-image --exit-code 1 --severity HIGH,CRITICAL
```

如果發現高嚴重性或關鍵性漏洞，這將使建構失敗。

**最佳實踐**：
- 定期掃描映像
- 使用最小基礎映像（如 Alpine）
- 保持基礎映像和依賴項更新
- 在部署前自動化掃描
- 根據漏洞嚴重性設定策略

### 65. 如何使用 Docker 實施藍綠部署？

藍綠部署是一種發布管理策略，其中你有兩個環境（藍色和綠色）執行相同的應用程式。一個（藍色）是即時的並服務生產流量，而另一個（綠色）是空閒的或用於預發環境。

**使用 Docker 實施藍綠部署**：

**步驟 1：設定兩個環境**

創建兩組容器（藍色和綠色）：

```bash
# 藍色環境（當前生產）
docker run -d --name app-blue -p 8080:80 my-app:v1

# 綠色環境（新版本）
docker run -d --name app-green -p 8081:80 my-app:v2
```

**步驟 2：測試綠色環境**

在綠色環境中執行測試以確保新版本正常工作：

```bash
curl http://localhost:8081
```

**步驟 3：切換流量**

一旦驗證，切換流量從藍色到綠色。這可以透過更新負載平衡器或反向代理配置來完成。

使用 Nginx 作為反向代理的範例：

```nginx
upstream backend {
    server app-blue:80;  # 藍色環境
}
```

切換到綠色：

```nginx
upstream backend {
    server app-green:80;  # 綠色環境
}
```

重新載入 Nginx：

```bash
nginx -s reload
```

**步驟 4：監視和驗證**

監視綠色環境以確保沒有問題。

**步驟 5：回滾（如果需要）**

如果出現問題，快速切換回藍色環境：

```nginx
upstream backend {
    server app-blue:80;  # 回到藍色
}
```

**使用 Docker Compose 的藍綠部署**：

```yaml
version: '3'
services:
  app-blue:
    image: my-app:v1
    ports:
      - "8080:80"
  
  app-green:
    image: my-app:v2
    ports:
      - "8081:80"
  
  nginx:
    image: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
```

**使用 Docker Swarm 的藍綠部署**：

```bash
# 部署藍色服務
docker service create --name app-blue --replicas 3 my-app:v1

# 部署綠色服務
docker service create --name app-green --replicas 3 my-app:v2

# 更新路由以指向綠色
docker service update --label-add color=green app-green

# 移除藍色服務
docker service rm app-blue
```

**優點**：
- 零停機部署
- 快速回滾能力
- 完整的生產測試
- 減少風險

### 66. 如何使用 Docker Secrets 管理敏感資訊？

Docker Secrets 提供了一種安全的方式來管理敏感資料，如密碼、API 金鑰和憑證，並將其傳遞給容器。Secrets 在 Docker Swarm 中可用，並在靜態和傳輸中加密。

**在 Docker Swarm 中創建和使用 Secrets**：

**步驟 1：創建 Secret**

從檔案創建 secret：

```bash
echo "mysecretpassword" | docker secret create db_password -
```

或從檔案：

```bash
docker secret create db_password ./password.txt
```

**步驟 2：列出 Secrets**

```bash
docker secret ls
```

**步驟 3：在服務中使用 Secret**

部署服務時，你可以指定它需要的 secrets：

```bash
docker service create \
  --name myapp \
  --secret db_password \
  my-image
```

在容器內，secret 將作為檔案掛載在 `/run/secrets/` 中：

```bash
cat /run/secrets/db_password
```

**步驟 4：在應用程式中使用 Secret**

你的應用程式可以讀取 secret 檔案：

```python
# Python 範例
with open('/run/secrets/db_password', 'r') as f:
    password = f.read().strip()
```

**在 Docker Compose 中使用 Secrets**：

```yaml
version: '3.8'
services:
  db:
    image: mysql
    secrets:
      - db_password
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    file: ./db_password.txt
```

**在 Kubernetes 中管理 Secrets**：

在 Kubernetes 中，secrets 使用 Secret API 資源儲存和管理。

**創建 Secret**：

```bash
kubectl create secret generic my-secret --from-literal=password=mysecret
```

**在 Pod 中使用 Secrets**：

你可以在 Pod 的環境變數或卷中引用 secrets。例如，將 secret 掛載為檔案：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mycontainer
    image: myimage
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
  volumes:
  - name: secret-volume
    secret:
      secretName: my-secret
```

Docker Swarm 和 Kubernetes 中的 Secrets 在靜態時加密，可以在服務或 Pod 之間安全共享。

### 67. 如何將主機目錄掛載到 Docker 容器？

你可以使用 `docker run` 命令中的 `-v` 或 `--volume` 標誌將主機目錄掛載到 Docker 容器。這允許你在主機機器和容器之間共享檔案，實現持久性儲存或資料共享。

**基本語法**：

```bash
docker run -v <host_directory>:<container_directory> <image_name>
```

**範例**：

將主機的 `/host/data` 目錄掛載到容器內的 `/container/data` 目錄：

```bash
docker run -v /host/data:/container/data my-image
```

如果主機目錄不存在，Docker 將創建它。如果容器目錄不存在，Docker 也會創建它。

**唯讀掛載**：

你也可以透過在掛載後附加 `:ro` 將卷指定為唯讀：

```bash
docker run -v /host/data:/container/data:ro my-image
```

這確保容器無法修改主機目錄。

**使用綁定掛載與命名卷**：

```bash
# 綁定掛載（直接主機路徑）
docker run -v /absolute/path/on/host:/path/in/container my-image

# 命名卷（由 Docker 管理）
docker run -v my_volume:/path/in/container my-image
```

**在 Docker Compose 中**：

```yaml
version: '3'
services:
  web:
    image: my-image
    volumes:
      - /host/data:/container/data
      - my_volume:/container/volume

volumes:
  my_volume:
```

這種方法允許持久性資料儲存或在主機和容器之間輕鬆共享檔案，通常用於開發環境。

### 68. 什麼是 Docker 容器編排？

Docker 容器編排是指以自動化和高效的方式管理、部署和擴展多個 Docker 容器。當執行涉及許多容器的大型應用程式時，這特別必要，每個容器服務於不同的目的（例如，資料庫容器、Web 伺服器容器等）。編排平台確保容器在主機之間正確分發、連網、根據負載擴展或縮減，並監視健康狀況。

**Docker 的熱門編排工具包括**：

**1. Docker Swarm**：
- Docker 的原生編排解決方案
- 簡單易用
- 與 Docker CLI 整合
- 適用於中小型部署

**2. Kubernetes**：
- 最廣泛採用的容器編排平台
- 高度可擴展和功能豐富
- 大型社群和生態系統
- 適用於大規模、企業級部署

**3. Apache Mesos**：
- 分散式系統核心
- 可以與 Marathon 一起編排容器
- 高度可擴展

**編排的關鍵組件**：

- **服務發現**：容器可以自動發現和通訊
- **負載平衡**：在多個容器之間分配流量
- **擴展**：根據需求自動擴展或縮減容器
- **自我修復**：自動替換失敗的容器
- **滾動更新**：在不停機的情況下更新服務
- **資源管理**：優化資源使用

Docker 編排確保容器可以大規模管理，提供高可用性、負載平衡和從故障中恢復，無需手動干預。

### 69. 如何創建和使用自訂 Docker 網路？

創建自訂 Docker 網路允許你控制容器如何彼此通訊以及與主機系統通訊。Docker 網路對於隔離容器和定義網路策略很有用。

**以下是創建和使用自訂網路的方法**：

**步驟 1：創建自訂橋接網路**

Docker 提供幾種網路驅動程式，bridge 驅動程式是自訂網路最常見的。要創建自訂橋接網路，使用以下命令：

```bash
docker network create --driver bridge my_custom_network
```

**步驟 2：在自訂網路上執行容器**

創建自訂網路後，你可以透過在 `docker run` 命令中指定 `--network` 標誌在其上執行容器：

```bash
docker run --network my_custom_network -d --name my_container my_image
```

**步驟 3：檢查自訂網路**

要檢查有關自訂網路的詳細資訊，如附加到它的容器，執行：

```bash
docker network inspect my_custom_network
```

**步驟 4：連接現有容器到網路**

你也可以將現有容器連接到自訂網路：

```bash
docker network connect my_custom_network my_existing_container
```

**步驟 5：斷開容器與網路的連接**

```bash
docker network disconnect my_custom_network my_container
```

**網路類型**：

- **Bridge**：預設，用於單主機上的容器通訊
- **Host**：容器使用主機的網路堆疊
- **Overlay**：用於跨多個主機的通訊（Docker Swarm）
- **Macvlan**：為容器分配 MAC 地址

**在 Docker Compose 中使用自訂網路**：

```yaml
version: '3'
services:
  web:
    image: nginx
    networks:
      - my_network
  
  db:
    image: mysql
    networks:
      - my_network

networks:
  my_network:
    driver: bridge
```

自訂網路提供更好的隔離、服務發現（容器可以透過名稱通訊）和網路策略控制。

### 70. 如何在 Docker 化環境中管理日誌？

在 Docker 化環境中管理日誌對於故障排除、監視和效能分析至關重要。有幾種策略和工具可以處理 Docker 日誌：

**1. 預設日誌驅動程式（json-file）**：

預設情況下，Docker 使用 json-file 日誌驅動程式，它將日誌以 JSON 格式儲存在主機檔案系統上。你可以使用以下命令訪問日誌：

```bash
docker logs <container_id>
```

**2. 配置日誌驅動程式**：

Docker 支援多種日誌驅動程式：

- **json-file**（預設）：以 JSON 格式在本地儲存日誌
- **syslog**：將日誌發送到 syslog 伺服器
- **journald**：發送到 systemd journal
- **gelf**：發送到 Graylog
- **fluentd**：發送到 Fluentd
- **awslogs**：發送到 AWS CloudWatch
- **splunk**：發送到 Splunk

要為容器指定日誌驅動程式，在 `docker run` 命令中使用 `--log-driver` 選項：

```bash
docker run --log-driver=syslog my-image
```

**3. 集中式日誌記錄**：

對於生產環境，使用集中式日誌記錄解決方案：

- **ELK Stack**（Elasticsearch、Logstash、Kibana）
- **Fluentd + Elasticsearch + Kibana**
- **Splunk**
- **AWS CloudWatch**
- **Google Cloud Logging**

**使用 Fluentd 的範例**：

```bash
docker run --log-driver=fluentd \
  --log-opt fluentd-address=localhost:24224 \
  my-image
```

**4. 日誌輪替和管理**：

配置日誌輪替以防止日誌檔案變得太大：

```bash
docker run --log-opt max-size=10m --log-opt max-file=3 my-image
```

**5. 在 Docker Compose 中配置日誌**：

```yaml
version: '3'
services:
  web:
    image: my-image
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

**6. 查看和過濾日誌**：

```bash
# 跟隨日誌
docker logs -f <container_id>

# 顯示最後 100 行
docker logs --tail 100 <container_id>

# 顯示特定時間後的日誌
docker logs --since 2h <container_id>

# 顯示帶時間戳的日誌
docker logs -t <container_id>
```

**7. 使用卷儲存日誌**：

將日誌寫入掛載的卷以便於訪問和備份：

```bash
docker run -v /host/logs:/app/logs my-image
```

**最佳實踐**：

- 使用集中式日誌記錄以便於分析
- 實施日誌輪替以管理磁碟空間
- 使用結構化日誌記錄（JSON 格式）
- 設定日誌保留策略
- 監視日誌大小和效能影響
- 在生產中使用專用的日誌記錄解決方案

有效的日誌管理確保你可以快速診斷問題、監視應用程式健康狀況並保持安全合規性。