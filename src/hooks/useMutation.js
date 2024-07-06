import { useMutation as useGqlMutation } from "react-query";
import { request, gql } from "graphql-request";

function useMutation(mutation, variables) {
  const mutationFn = async () => {
    const data = await request(
      "http://localhost:8000/graphql",
      gql`
        ${mutation}
      `,
      variables
    );
    return data;
  };

  return useGqlMutation(mutationFn);
}

export default useMutation;
