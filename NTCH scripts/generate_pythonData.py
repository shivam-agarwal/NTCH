import shutil
import pickle
import csv

names = [line.rstrip('\n') for line in open('input/nodes.csv')]

id_name_dictionary = {}
for x in range(0, len(names)):
	idLabel = names[x].split(',')
	idLabel[0] = int(idLabel[0])
	#print idLabel
	id_name_dictionary[idLabel[0]] = idLabel[1]

dictionaryMatrixLin_Similarity={}
dictionaryMatrixJcn_Similarity= {}
# 
dictionaryMatrix={}
for x in range(0,len(names)):
	idLabel = names[x].split(',')
	idLabel[0] = int(idLabel[0])
	dictionaryMatrix[idLabel[0]] = {}
	dictionaryMatrixLin_Similarity[idLabel[0]] = {}
	dictionaryMatrixJcn_Similarity[idLabel[0]] = {}
	for y in range(0,len(names)):
		idLabel2 = names[y].split(',')
		idLabel2[0] = int(idLabel2[0])
		dictionaryMatrix[idLabel[0]][idLabel2[0]]=0
		dictionaryMatrixLin_Similarity[idLabel[0]][idLabel2[0]]=0
		dictionaryMatrixJcn_Similarity[idLabel[0]][idLabel2[0]]=0

dataLines = [line.rstrip('\n') for line in open('input/layer1edges.csv')]


for x in range(0,len(dataLines)):
	temp= dataLines[x].split(",")
	#print temp
	temp[0] = int(temp[0])
	temp[1] = int(temp[1])
	temp[2] = float(temp[2])
	#print temp
	#print dictionaryMatrix[int(temp[0])]
	dictionaryMatrix[temp[0]][temp[1]] = temp[2]
	dictionaryMatrix[temp[1]][temp[0]] = temp[2]


layer2_edge_line = [line.rstrip('\n') for line in open('input/layer2edges.csv')]
for x in range(0,len(layer2_edge_line)):
	temp= layer2_edge_line[x].split(",")
	temp[0] = int(temp[0])
	temp[1] = int(temp[1])
	temp[2] = float(temp[2])
	dictionaryMatrixLin_Similarity[temp[0]] [temp[1]] = temp[2]
	dictionaryMatrixLin_Similarity[temp[1]] [temp[0]] = temp[2]




layer3_edge_line = [line.rstrip('\n') for line in open('input/layer3edges.csv')]
for x in range(0,len(layer3_edge_line)):
	temp= layer2_edge_line[x].split(",")
	temp[0] = int(temp[0])
	temp[1] = int(temp[1])
	temp[2] = float(temp[2])
	dictionaryMatrixJcn_Similarity[temp[0]] [temp[1]] = temp[2]
	dictionaryMatrixJcn_Similarity[temp[1]] [temp[0]] = temp[2]
    
# print dictionaryMatrix, dictionaryMatrixLin_Similarity, dictionaryMatrixJcn_Similarity

pickle.dump( dictionaryMatrix, open( "output/pythondata_test/dictionaryMatrix.p", "wb" ) )
pickle.dump( dictionaryMatrix, open( "output/pythondata_test/co-authorship_dictionary_matrix.p", "wb" ) )
pickle.dump( id_name_dictionary, open( "output/pythondata_test/id_name_dictionary.p", "wb" ) )
pickle.dump( dictionaryMatrixLin_Similarity, open( "output/pythondata_test/author_topic_dictionary_matrix.p", "wb" ) )
pickle.dump( dictionaryMatrixLin_Similarity, open( "output/pythondata_test/co-citation_authors_dictionary_matrix.p", "wb" ) )

shutil.copy2('input/AdjacencyMatrices.csv', 'output/test/AdjacencyMatrices.csv')
shutil.copy2('input/AdjacencyMatrices.csv', 'output/test/DissimilarityMatrices.csv')
shutil.copy2('input/AdjacencyMatrices.csv', 'output/test/EigenMatrix.csv')
shutil.copy2('input/layer3edges.csv', 'output/test/layer3edges.csv')
shutil.copy2('input/layer1edges.csv', 'output/test/Edges.csv')