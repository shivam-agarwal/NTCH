Input files should be placed in input folder. The files should be:
1. AdjacencyMatrices.csv - describes individual matrix for every community
2. nodes.csv - describes nodeid and nodelabel
3. layer1edges.csv - layer3edges.csv - describe the edges of individual layers

Run generate_pythonData.py file. The output files will be placed in output folder. After that you have to do following:

1. Copy the contents of output/test folder to NTCH app/static/dataSets/test folder
2. Copy the contents of output/pythondata_test to NTCH app/static/server_services/pythondata_test folder
3. run the server.py file in NTCH app: python server.py
4. This should start the app in localhost:8000 address. Open using chrome