import csv

adjacency_matrices = [line.rstrip('\n') for line in open('AdjacencyMatrices.csv')]




x=0
condition=True
# for x in range(0,len(adjacency_matrices)):
numberOfMatrices=0
while condition:
	# print x
	numberOfMatrices +=1
	sizeofcurrentmatrix = (adjacency_matrices[x].split(',')[0])
	sizeofcurrentmatrix = int(sizeofcurrentmatrix)
	
	# print authoridsarray
	
	# print  sizeofcurrentmatrix, adjacency_matrices[x]
	# print authoridarray

	x = x+sizeofcurrentmatrix+3
	if x>len(adjacency_matrices)-1:
		condition = False

# print multilayer_edge_matrix	
print numberOfMatrices

