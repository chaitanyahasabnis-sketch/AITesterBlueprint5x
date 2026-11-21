# Task for 07-Nov-2026:
1. Generate the test cases for app.vwo.com using RICEPOT framework and Anti-Hallucination rule
2. Once we receive the output, we need to provide some information for the gaps and then regenerate it and have to watch how effectively the Agent is capable of providing the test cases once the information requested are provided.

## First prompt:
You need to create test cases for [app.vwo.com](https://app.vwo.com/) or [app.wingify.com](https://app.wingify.com/#/login) by using the RICE PORT method @Chapter_02_Prompt_Engineering/Template_RICE_POT/Template.RICEPPOT.md with 
@Chapter_02_Prompt_Engineering/RICEPOT_Template_without_hallucination.md in the @Chapter_02_Prompt_Engineering/output folder

## Second prompt:
You need to create test cases for [app.vwo.com](https://app.vwo.com/) or [app.wingify.com](https://app.wingify.com/#/login) by using the RICE PORT method @Chapter_02_Prompt_Engineering/RICE_POT/Template_RICE_POT/Template.RICEPPOT.md with @Chapter_02_Prompt_Engineering/anti-hallucination-rules.md in the @Chapter_02_Prompt_Engineering/output folder

Whatever information you have, you have to tell me how many missing gaps it has found when you have used the anti-hallucination rules.

## Third Prompt:
Gap Information:
Gap-01: Both the links app.vwo.com; app.wingify.com are same. Previously it was app.vwo.com and now if we hit that link, this link will be populated app.wingify.com
Now regenerate with new version the test cases using the RICE PORT method @Chapter_02_Prompt_Engineering/RICE_POT/Template_RICE_POT/Template.RICEPPOT.md with @Chapter_02_Prompt_Engineering/anti-hallucination-rules.md in the @Chapter_02_Prompt_Engineering/output folder and generate a report in html format whether After giving the information, was the better test case can be provided or not?
