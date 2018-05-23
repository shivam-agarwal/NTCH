import csv

adjacency_matrices = [line.rstrip('\n') for line in open('AdjacencyMatrices.csv')]


number_of_nodes = 0
number_of_edges = 0

x=0
condition=True
# for x in range(0,len(adjacency_matrices)):
numberOfMatrices=0
while condition:
	# print x
	numberOfMatrices +=1
	sizeofcurrentmatrix = (adjacency_matrices[x].split(',')[0])
	sizeofcurrentmatrix = int(sizeofcurrentmatrix)
	number_of_nodes = sizeofcurrentmatrix
	# print authoridsarray
	
	# print  sizeofcurrentmatrix, adjacency_matrices[x]
	# print authoridarray

	x = x+3
	for i in range(0,sizeofcurrentmatrix):
		tempLine = (adjacency_matrices[x].split(','))
		for j in range(0, len(tempLine)):
			tempEdgeWeight = int(tempLine[j])
			if tempEdgeWeight>0:
				number_of_edges +=1
		x = x+1

	if x>len(adjacency_matrices)-1:
		condition = False

# print multilayer_edge_matrix	
print numberOfMatrices
print "number of nodes: ", number_of_nodes
print "number of edges: ", number_of_edges/2

